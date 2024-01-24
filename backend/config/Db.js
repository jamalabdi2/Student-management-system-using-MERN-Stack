import mongoose, { mongo } from "mongoose"
import chalk from "chalk"
const connectDB = async () =>{
    const DATABASE_URI = process.env.DATABASE_URI
    try {
        await mongoose.connect(DATABASE_URI)
        console.log(`${chalk.blue.bold("\nSuccessfully connected to the Database")}`)
    } catch (connectionError) {
        console.error("Error connected to the database.")
        console.log(connectionError)
        process.exit(1)
    }

}

export default connectDB
