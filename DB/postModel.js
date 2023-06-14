import { Schema,model } from "./dbConnection.js";

const postSchema = new Schema({
    caption:String,
    image:{
        public_id:String,
        url:String
    },
    limitedTo:{
        type:String,
        default:'public',
        enum:['public','friends','friends except...','only me','specific friend']
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },

    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],

    dislikes:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],

    comments:[
        {
            user:{
            type:Schema.Types.ObjectId,
            ref:'User'
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
},{timestamps:true})

export const postModel = new model('Post',postSchema)