import handleAsync from "async-error-handler"
import { errorThrow } from "../Utils/errorHandler.js"
import jwt from 'jsonwebtoken'
import { env } from "../index.js"
import { userModel } from "../DB/userModel.js"

export const isAuthenticated=handleAsync(async(req,res,next)=>{

    const {login_token} = req.cookies

    if(!login_token){
        errorThrow("Log in to access this resource",403,"Access denied")
    }
    else{
        try {
       
            const decodedJsonWebToken = jwt.verify(login_token,env.JWT_SECRET_KEY)
    
            req.user = await userModel.findById(decodedJsonWebToken.jwt_user_id)
    
            next()
            
        } catch (error) {
            next(error)
        }
    }

    
},(err,req,res,next)=>next(err))

export const isAuthorizedRole=(...roles)=>{

    return (req,res,next)=>{
        // if the user role not include in role array
        if(!roles.includes(req.user.role)){
            errorThrow(`This resource is not authorized for ${req.user.role}s`,403,"Permission denied")
        }
        next()
    }
    
}