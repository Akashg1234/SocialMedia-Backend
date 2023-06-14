import handleAsync from 'async-error-handler'
import { postModel } from '../DB/postModel.js'
import {userModel} from '../DB/userModel.js'
import { errorThrow } from '../Utils/errorHandler.js'

export const createPost = handleAsync(async(req,res,next)=>{

    try {
        const newPostData = {
            caption:req.body.caption,
            owner:req.user._id,
            limitedTo:req.body.limitedTo
        }

        const newPost = await postModel.create(newPostData)

        let user = await userModel.findById(req.user._id)

        user.posts.push(newPost._id)

        await user.save()

        res.status(201).json({
            success:true,
            newPost
        })

    } catch (error) {
        next(error)
    }
},(err,next)=> next(err))

// like the post
export const postLike = handleAsync(async(req,res,next)=>{
    try {
        const post = await postModel.findById(req.params.postId)

        if(!post){
            errorThrow("Post not found",404,"Document missing")
        }

        const user = await userModel.findById(req.user._id)

        if(post.likes.includes(user._id)){
            post.likes.pull(user._id)
            
        }
        else if(post.dislikes.includes(user._id)){
            post.dislikes.pull(user._id)
            post.likes.push(user._id)

        }
        else{
            post.likes.push(user._id)
            
        }

        await post.save()
        res.status(200).json({
                success:true,
                message:"Likes updated"
            })

        
        
    } catch (error) {
        next(error)
    }
},(err,next)=>next(err))

// dislike the post
export const postUnlike = handleAsync(async(req,res,next)=>{
    try {
        const post = await postModel.findById(req.params.postId)

        if(!post){
            errorThrow("Post not found",404,"Document missing")
        }

        const user = await userModel.findById(req.user._id)

        if(!user){
            errorThrow("user not found",404,"Document missing")
        }

        if(post.dislikes.includes(user._id)){
            post.dislikes.pull(user._id)
            
        }
        else if(post.likes.includes(user._id)){
            post.likes.pull(user._id)
            post.dislikes.push(user._id)

        }
        else{
            post.dislikes.push(user._id)
            
        }

        await post.save()

        res.status(200).json({
                success:true,
                message:"Dislikes updated"
            })

        

    } catch (error) {
        next(error)
    }
},(err,next)=>next(err))

// delete the post
export const deletePost = handleAsync(async(req,res,next)=>{
    try {
        const post = await postModel.findById(req.params.postId)

        if(!post){
            errorThrow("Post not found",404,"Document missing")
        }

        const user = await userModel.findById(req.user._id)

        if(post.owner.toString() !== user._id.toString()){
            errorThrow("This post is not belongs to you",401,"Permission denied")
        }

        user.posts.pull(post._id)

        await user.save()

        await post.deleteOne()

        res.status(200).json({
                success:true,
                message:"Post deleted"
            })

    } catch (error) {
        next(error)
    }
},(err,next)=>next(err))


// update the post caption
export const updatePostCaption = handleAsync(async(req,res,next)=>{
    try {

        const {newCaption,limitedTo} = req.body

        const post = await postModel.findById(req.params.postId)

        if(!post){
            errorThrow("Post not found",404,"Document missing")
        }

        const user = await userModel.findById(req.user._id)

        if(post.owner.toString() !== user._id.toString()){
            errorThrow("This post is not belongs to you",401,"Permission denied")
        }

        post.caption=newCaption
        post.limitedTo=limitedTo

        await post.save()

        res.status(200).json({
                success:true,
                message:"Post updated",
                post
            })

    } catch (error) {
        next(error)
    }
},(err,next)=>next(err))


// add comment the post caption
export const addComment = handleAsync(async(req,res,next)=>{
    try {

        const {comment} = req.body

        const post = await postModel.findById(req.params.postId)

        if(!post){
            errorThrow("Post not found",404,"Document missing")
        }

        
        const newComment = {
            user:req.user._id,
            comment:comment
        }

        post.comments.push(newComment)

        await post.save()

        res.status(200).json({
                success:true,
                message:"Comment added"
            })

    } catch (error) {
        next(error)
    }
},(err,next)=>next(err))


// update the post caption
export const deleteComment = handleAsync(async(req,res,next)=>{
    try {

        
        const post = await postModel.findById(req.params.postId)

        if(!post){
            errorThrow("Post not found",404,"Document missing")
        }

        // if owner wants to delete
        if(post.owner.toString()===req.user._id.toString()){
            for (const item of post.comments) {
                if(item._id.toString()===req.body.commentId.toString())
                {
                    post.comments.pull()
                }
            }
            await post.save()
        }
        else{
            for (const item of post.comments) {
                if(item.user.toString()===req.user._id.toString()){
                    post.comment.pull(item)
                }
            }
            // post.comments
            await post.save()
        }
        
        res.status(200).json({
                success:true,
                message:"Comment deleted"
            })

    } catch (error) {
        next(error)
    }
},(err,next)=>next(err))