export const sendAllToken = (user,message,res,statusCode)=>{
    const token = user.getJwtToken()
    
    const reFreshTokenOptions = {
        expires: new Date(Date.now() + 15*24*60*60*1000),
        httpOnly:true,
    }

    res.status(statusCode).cookie('login_token',token,reFreshTokenOptions).json({
        success:true,
        message,
        user,
        token
    })
}