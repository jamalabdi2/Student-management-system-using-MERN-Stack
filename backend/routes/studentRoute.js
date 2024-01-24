import express from "express"
const router = express.Router()
import {
    getAllStudent, 
    registerStudent, 
    getStudentById,
    verifyToken, 
    login,
    handle404Route,
    protect
} from "../controllers/studentController.js"



router.get("/students",getAllStudent)

//post request

router.post("/newStudent",registerStudent)

//get student by id
router.get("/student/:studentId",getStudentById)

//login post requests
router.post("/student/login",login)

// verify student email
router.get("/student/verify/:id/:token",verifyToken)

// protect route
router.post('/protect',protect)
//get request for page that dont exists
router.get("*",handle404Route)

export default router