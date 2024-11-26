
import jwt from 'jsonwebtoken'

const auth =async(req,res,next) => {
    try {
        const token = req.cookies.accessToken || req?.header?.authorization.split(" ")[1]   // ["Bearer","token"] 
        

        if(!token){
            return res.status(401).json({
                message:"Provide token"
            })
        }

        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
    
        if(!decode){
            return res.status(401).json({
                message:"unauthorize access",
                error:true,
                success:true
            })
        }
        req.userID = decode.id

        next()
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error:true,
            success: false
        })
    }
}



export default auth