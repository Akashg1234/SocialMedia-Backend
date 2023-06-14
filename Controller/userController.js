import handleAsync from "async-error-handler";
import { userModel } from "../DB/userModel.js";
import { errorThrow } from "../Utils/errorHandler.js";
import { sendAllToken } from "../Utils/jsonWebTokenHandler.js";
import { postModel } from "../DB/postModel.js";
import { sendEmail } from "../Utils/sendMail.js";
import {createHash} from 'crypto'

export const userResgister = handleAsync(async(req,res,next)=>{
    try {
        let {firstname,lastname,email,password,day,month,year,gender} = req.body

        
        let newUser = await userModel.findOne({email})

        if(newUser){
            errorThrow("User alredy exist",400,"Duplicate document")
        }

        newUser = await userModel.create({
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:password,
            contactAndBasicInfo:{
                basicInfo:{
                    birthdate:{
                    day:day,
                    month:month,
                    year:year
                    },
                    gender:gender
                }
            },
        })

        res.status(201).json({
            success:true,
            newUser
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>next(err))


export const userLogin = handleAsync(async(req,res,next)=>{
    try {
        let {email,password} = req.body

        const user = await userModel.findOne({email}).select('+password')

        if(user && await user.comparePassword(password)){
            sendAllToken(user,"Login successful",res,200)
        }
        else{
            errorThrow("Invalid credentials",401,"Not matched")
        }

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>next(err))

// log out user handler
export const logoutUser = handleAsync(async(req,res,next)=>{
    // set 'login_token' to null and expire it now 

    res.clearCookie('login_token',null,{
        expires:new Date(Date.now()),
        httpOnly:true,
        
    }).status(200).json({
        success:true,
        message:"Log out user"
    })

},(err,req,res,next)=>next(err))
// follow unfollow user handler
export const followUnfollowUser = handleAsync(async(req,res,next)=>{
    try {
        
        const userToFollow = await userModel.findById(req.params.userId)
        const userLogedIn = await userModel.findById(req.user._id)

        if(!userToFollow){
            errorThrow("User not exist",404,"Missing document")
        }

        
        if(userLogedIn.following.includes(userToFollow._id)){

            userLogedIn.following.pull(userToFollow._id)
            userToFollow.followers.pull(userLogedIn._id)

            await userToFollow.save()
            await userLogedIn.save()

            res.status(200).json({
                success:true,
                message:`Now you unfollowed ${userToFollow.firstname} ${userToFollow.lastname} `
            })
    
        }
        else{

            userLogedIn.following.push(userToFollow._id)
            userToFollow.followers.push(userLogedIn._id)

            await userToFollow.save()
            await userLogedIn.save()

            res.status(200).json({
                success:true,
                message:`Now you following ${userToFollow.firstname} ${userToFollow.lastname} `
            })

        }

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>next(err))

// get posts from follwing users
export const getPostFromFollowings = handleAsync(async(req,res,next)=>{
    try {
        const user = await userModel.findById(req.user._id)

        const post = await postModel.find({
            owner:{
                $in:user.following
            }
        })

        res.status(200).json({
            success:true,
            post
        })

    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>next(err))


// update user password handler
export const updateUserPassword = handleAsync(async(req,res,next)=>{

    try {
        const {oldPassword,newPassword} = req.body

        let user = await userModel.findById(req.user._id).select('+password')

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }

        const isMatched = await user.comparePassword(oldPassword)

        if(!isMatched){
            errorThrow("Password not matched",401,"Password Error")
        }

        user.password = newPassword

        await user.save()

        res.status(200).json({
            success:true,
            "message":"Password changed successfully"
        })
    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>next(err))

// All update and upgrade API will be here

// delete my account
export const deleteMyAccount = handleAsync(async(req,res,next)=>{

    try {
        
        const user = await userModel.findById(req.user._id)

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }
// delete all posts of the user
        for (const userPost of user.posts) {
            const post= await postModel.findById(userPost)
            await post.deleteOne()
        }
        // remove user from followers following
        for (const followerUser of user.followers) {
            const follower = await userModel.findById(followerUser)
            follower.following.pull(follower)
            await follower.save()
        }
        // remove user from followers following
        for (const followingUser of user.following) {
            const following = await userModel.findById(followingUser)
            following.followers.pull(following)
            await following.save()
        }

        await user.deleteOne()

        res.status(200).json({
            success:true,
            "message":"Password changed successfully"
        })

    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>next(err))

// my account
export const myAccount = handleAsync(async(req,res,next)=>{

    try {
        
        const user = await userModel.findById(req.user._id).populate('posts')

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }

        res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>next(err))

// users account
export const getUserAccount = handleAsync(async(req,res,next)=>{

    try {
        
        const user = await userModel.findById(req.params.userId).populate('posts')

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }

        res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>next(err))


// Forget Password
export const forgetPassword = handleAsync(async(req,res,next)=>{

    try {
        const {email} = req.body

        const user = await userModel.findOne({email:email})

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }
        const resetToken = await user.getPasswordResetToken()

        await user.save()
        const url = `${process.env.FRONT_END_URL}/resetpassword/${resetToken}`
        const message = `Click to the link to reset your password.\n ${url}.\n If you not requested then ignore it.`
    
        // send token via email
        await sendEmail(user.email,"Password Reset Token",message)
    
        res.status(200).json({
            success:true,
            resetToken,
            message:`Reset token send successfully to ${email}`
        })

    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>next(err))

// unblock user profile 
export const resetPasswordToken = handleAsync(async(req,res,next)=>{

    try {
        
        const {password} = req.body
        const {token} = req.params
        const hashedToken = createHash('sha256').update(token).digest('hex')
        
        let user = await userModel.findOne({
            ResetPasswordToken:hashedToken,
            ResetPasswordExpire:{
                $gt:Date.now()
            }
        })

        if(!user){
            errorThrow("Token has been expired",401,"Reset password token error")
        }
        
        
        user.password = password
        user.ResetPasswordToken=undefined
        user.ResetPasswordExpire=undefined

        await user.save()

        res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})


