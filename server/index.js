import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDb from './config/connectDB.js'
import userRouter from './route/userRoute.js'

dotenv.config()

const app = express()
app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy:false
}))

const PORT = 8080 || process.env.PORT

app.get("/",(req,res)=>{
    res.json("hello")
})


app.use('/api/user',userRouter)

connectDb().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running at ${PORT}`)
    })
})




