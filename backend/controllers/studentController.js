import {StudentModel,validate} from "../model/studentSchema.js"
import bcrypt from "bcrypt"
import { NotFoundError,InternalServerError } from "../middlewares/error.js"
import mongoose from "mongoose"
import {tokenModel} from "../model/tokenSchema.js"
import crypto, { generateKey } from "crypto"
import {sendEmail} from "../utils/sendEmail.js"
import { send } from "process"
import path from "path";
import fs from "fs/promises";
import {createSecretToken} from "../utils/SecretToken.js"
import {promisify} from "util"
import jsonwebtoken from "jsonwebtoken"

import dotenv from "dotenv"
dotenv.config()

const sendResponse = (res,status,success,message,data = null) =>{
    return res.status(status).json({
        status,
        success,
        message,
        data
    })
}

const getAllStudent = async (req,res) =>{
    try {
        const students = await StudentModel.find()
        return sendResponse(res,200,true,"student successfully retrieved",students)

    } catch (error) {
        console.error(error.message)
        return sendResponse(res,501,false,"Internal server error",error.message)
    }
}
const getStudentById = async (req,res) =>{
    const studentId = req.params.studentId
    console.log(studentId)

    try {
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return sendResponse(res, 400, false, 'Invalid student ID format', null);
        }

        const student = await StudentModel.findById(studentId)
        if(!student){
            throw new NotFoundError(`Student with id ${studentId} does not exists`)
        }

        return sendResponse(res, 200, true, 'Student found', { student });
    } catch (error) {
        console.error(error.message)
        throw new InternalServerError("Internal server error")
        
    }

}

const registerStudent1 = async (req,res) =>{
    const {firstName,lastName,password} = req.body
    console.log(firstName,lastName)

    //hash password
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const hashedPassword = await bcrypt.hash(password,salt)
    console.log(`hashed password: ${hashedPassword}`)

    //add hashed password to the request body
    const studentData = {...req.body,password: hashedPassword}
    try {
        const savedStudent = await StudentModel.create(studentData)
        savedStudent.password = undefined
        if(savedStudent){
            return sendResponse(res, 200, true, "Student created successfully", { student: savedStudent });
        }
        
    } catch (error) {
        console.error(error.message)
        return sendResponse(res, 500, false, "Internal server error", { errorMessage: error.message });
    }

}
const registerStudent = async (req,res) =>{
    try {
        //validate request body first
        const {validationError} = validate(req.body)
        if(validationError) return sendResponse(res,400,false,"Bad request fields are required")

        //check if user with that email exists
        const studentExists = await StudentModel.findOne({email: req.body.email})
        if(studentExists){
            return sendResponse(res,400,false,"user with given email already exists")
        }

        //hash the password
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        console.log(`Hashed password: ${hashedPassword}`)
        //add hashed password to the request body
        const requestData = {...req.body, password: hashedPassword}
        //save user
        const newStudent = await new StudentModel(requestData).save()
        
        //generate token and assign user id
        const studentId = newStudent._id
        const token = await new tokenModel({
            studentId,
            token: crypto.randomBytes(32).toString("hex"),
        }).save()

        //create message
        const BASE_URL = process.env.BASE_URL
        const TOKEN = token.token
        const message = `${BASE_URL}/api/v1/student/verify/${studentId}/${TOKEN}`
        console.log(`token url sent: ${message}`)
        const replacements = {
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            verificationToken: message

        }
        console.log(`Replacements: ${replacements}`)

        //send email
        await sendEmail(newStudent.email,"Verify Email","emailTemplate.html",replacements)
        return sendResponse(res,201,true,"An Email sent to your account please verify")
    } catch (error) {
        console.log(error)
        return sendResponse(res,500,false,"An error occured",error.message)
        
    }
}

const verifyToken = async (req,res) =>{
    try {
        //check if user exist
        const student = await StudentModel.findOne({_id: req.params.id})
        if(!student) return sendResponse(res,400,false,"Invalid link")

        const token = await tokenModel.findOne({
            studentId: student._id,
            token: req.params.token,
            expiresAt: {$gt: new Date()}

        })
        if(!token) return sendResponse(res,400,false,"Invalid link")

        // verify the student and remove the link
        await StudentModel.updateOne({_id: student._id,verified: true})

        await tokenModel.findByIdAndDelete(token._id)


        return res.redirect('http://localhost:3000/loginStudent');
        
        
    } catch (error) {
        console.log(error)
        return sendResponse(res,400,false,"An error occured",error.message)
        
    }
}


const login = async (req, res) => {
    // Check if the user exists
    const { email, password } = req.body;

    try {
        const student = await StudentModel.findOne({ email });
        if (!student) {
            return sendResponse(res, 401, false, `${email} does not exist, please check your email or register`);
        }

        const passwordValid = await bcrypt.compare(password, student.password);
        if (!passwordValid) {
            return sendResponse(res, 401, false, "Incorrect password");
        }

        if (!student.verified) {
            return sendResponse(res, 401, false, "Please verify your email");
        }

        // Generate JWT token and set it in the cookie
        const jwtToken = createSecretToken(student._id);
        res.cookie("jwttoken", jwtToken, {
            withCredentials: true,
            httpOnly: false
        });

        return sendResponse(res, 200, true, "Successfully logged in", student._id);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
};

const protect = async (req,res,next) =>{
    const {SECRET_KEY} = process.env
    console.log("Secret Key: ",SECRET_KEY)
    //read the token and check if it exist
    const tokenHeader = req.headers.authorization
    console.log(tokenHeader)
    let token;
    if(tokenHeader && tokenHeader.startsWith("bearer")){
        token = tokenHeader.split(" ")[1]
        console.log("token: ",token)
    }
    //validate the token
    if(!token){
        return sendResponse(res,401,false,"Not logged in")
    }
    //promisify the results from jwt
    try {
        const decodedoken = await promisify(jsonwebtoken.verify)(token,SECRET_KEY)
        console.log(`Decoded token: ${decodedoken}`)
        next()
    } catch (error) {
        if(error instanceof jsonwebtoken.TokenExpiredError){
            console.error("Token Expired")
            return sendResponse(res, 401, false, "Token expired");
        } else{
            console.error('Error verifying token: ',error.message)
            return sendResponse(res, 401, false, "Invalid token");
        }
        
    }

    
}

//controller for handling route that dont exists
const handle404Route = async (req,res) =>{
    const requestedUrl = req.originalUrl
    const acceptedTypes = req.accepts(['json','html','text'])
    console.log(acceptedTypes)

    if(acceptedTypes === 'json'){
        res.status(404).json({error: `Route not found: ${requestedUrl}`})
    }else if(acceptedTypes === 'html'){
        const BASE_DIR = '/Users/jamal/Documents/student_portal/backend/views'
        const templatePath = path.join(BASE_DIR,'404Html.html')
        const htmlTemplate = await fs.readFile(templatePath,'utf-8')
        const renderedHtml = htmlTemplate.replace('{{requestedUrl}}',requestedUrl)
        
        console.log(templatePath)
        console.log(renderedHtml)
        res.status(404).send(renderedHtml)
    } else if(acceptedTypes === 'text'){
        res.status(404).send(`Route not found: ${requestedUrl}`)
    } else{
        res.status(406).send('Not Acceptable')
    }

}
export {
    getAllStudent,
    registerStudent,
    getStudentById,
    verifyToken,
    login,
    handle404Route,
    protect
}
