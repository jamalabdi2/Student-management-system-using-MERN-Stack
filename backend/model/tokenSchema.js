import mongoose from "mongoose";
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    studentId : {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    token : {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000
    }
})

const tokenModel = mongoose.model("Token",tokenSchema)
export {tokenModel}