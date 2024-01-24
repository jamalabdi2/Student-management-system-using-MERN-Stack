import express, { urlencoded } from "express"
import chalk from "chalk"
import dotenv from 'dotenv'
import connectDB from './config/Db.js'
import router from "./routes/studentRoute.js"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use("/api/v1", router)

connectDB()
const PORT = process.env.PORT || 5890
const NODE_ENV = process.env.NODE_ENV

app.listen(PORT, () =>{
    console.log(`\nServer running in ${chalk.green.bold(NODE_ENV)} on port ${chalk.red.bold(PORT)}`)
})