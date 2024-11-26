import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGODB_URI){
throw new Error(
    "Please Provide MongoDb URI in the .env file "
)
}

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected Db')
    } catch (error) {
        console.log('mongodb connection error',error)
        process.exit(1)
    }
}

export default connectDb