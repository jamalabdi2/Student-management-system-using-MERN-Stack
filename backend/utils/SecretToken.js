import jsonwebtoken from "jsonwebtoken"
import dotenv from  "dotenv"
dotenv.config()

const {SECRET_KEY,EXPIRES_IN} = process.env
const expiresInNumeric = parseInt(EXPIRES_IN, 10);

const createSecretToken = (id) =>{
    return jsonwebtoken.sign({ id }, SECRET_KEY, { expiresIn: expiresInNumeric });
}
export {createSecretToken}