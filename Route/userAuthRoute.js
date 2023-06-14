import { Router } from "express";
import { addComment, createPost, deletePost, postLike, postUnlike, updatePostCaption } from "../Controller/postController.js";
import { deleteMyAccount, followUnfollowUser, forgetPassword, getPostFromFollowings, getUserAccount, logoutUser, myAccount, resetPasswordToken, updateUserPassword, userLogin, userResgister } from "../Controller/userController.js";
import { isAuthenticated, isAuthorizedRole } from '.././Middleware/authentication.js'
const userAccessMiddlewares=[isAuthenticated]
// isAuthorizedRole('user')

const route = Router()
export const postRoute=route ,userRoute=route ,adminUserRoute=route 

postRoute.post('/create',isAuthenticated,createPost)
postRoute.post('/like/:postId',isAuthenticated,postLike)
postRoute.post('/dislike/:postId',isAuthenticated,postUnlike)
postRoute.delete('/delete-post/:postId',isAuthenticated,deletePost)
postRoute.put('/update-post/:postId',isAuthenticated,updatePostCaption)
postRoute.post('/comment-post/:postId',isAuthenticated,addComment)


userRoute.post('/register',userResgister)
userRoute.post('/login',userLogin)
userRoute.put('/update/password',isAuthenticated,updateUserPassword)
userRoute.get('/logout',logoutUser)
userRoute.post('/follow-unfollow/:userId',isAuthenticated,followUnfollowUser)
userRoute.get('/get-post',isAuthenticated,getPostFromFollowings)
userRoute.delete('/delete-my-profile',isAuthenticated,deleteMyAccount)
userRoute.get('/profile',isAuthenticated,myAccount)
userRoute.get('/user-profile/:userId',isAuthenticated,getUserAccount)
// forgot password
userRoute.post('/password/forgot-password',
    forgetPassword
    )
// reset password with token
userRoute.put('/password/reset-password/:token',
    resetPasswordToken
    )