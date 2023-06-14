import { Schema,model } from "./dbConnection.js";
import bcrypt from "bcryptjs";
import {randomBytes,createHash} from 'crypto'
import jwt from 'jsonwebtoken'
import { env } from "../index.js";

const userSchema = new Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:[true,"Email is needed"],unique:[true,"Email already exist"]},
    password:{type:String,required:[true,"Password is needed"],select:false,minlength:[8,"Password must be atleast 8 charecter"]},
    bio:String,
    avatar:{
        public_id:String,
        url:String,
        // default:"https://cdn-icons-png.flaticon.com/512/6386/6386976.png"
    },
    coverPicture:{
        public_id:String,
        url:String
    },
    workAndEducation:{
        work:[
            {type:String},
        ],
        university:[{type:String},],
        highSchool:[{type:String},]
    },
    placeLived:[
        {type:String,},
    ],
    contactAndBasicInfo:{
        contactInfo:{
            phoneNumber:Number,
            email:String
        },
        webAndSocialInk:{
            websites:[{type:String}],
            socialLinks:[{type:String}],
        },
        basicInfo:{
            language:[{type:String}],
            gender:String,
            birthdate:{
                day:Number,
                month:Number,
                year:Number
            }
        }
    },
    familyAndRelationship:{
        relationShip:String,
        familyMemebers:[{
            user:{
                type:Schema.Types.ObjectId,
                ref:'User'
                }
        }]
    },
    hobbies:[
        {
            type:String
        }
    ],
    friends:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    posts:[{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }],
    
    followers:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],

    following:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    joined:{type:Date,default:Date.now()},

    resetToken:String,
    resetTokenExpire:Date
})


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,15)
    next()
})

userSchema.methods.comparePassword = async function (givenPassword) {
    
    return await bcrypt.compare(givenPassword,this.password)

}

userSchema.methods.getPasswordResetToken = function(){
    let resetToken = randomBytes(100).toString('hex')

    this.resetToken = createHash('sha256').update(resetToken).digest('hex')
    this.resetTokenExpire = Date.now() + 1800000

    return resetToken
}


userSchema.methods.getJwtToken = function () {
    return jwt.sign({jwt_user_id:this._id},env.JWT_SECRET_KEY,{expiresIn:'15d'})
}
export const userModel = new model('User',userSchema)