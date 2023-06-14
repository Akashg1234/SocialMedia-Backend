import express from 'express'
import { postRoute, userRoute } from './Route/userAuthRoute.js'
import cookieParser from 'cookie-parser'

export const userApp = express(),mainApp = express(),adminApp = express()

mainApp.use(express.json())
mainApp.use(express.urlencoded({extended:true}))
mainApp.use(cookieParser())

mainApp.use('/user',userApp)

// user app user
userApp.use('/',userRoute)
userApp.use('/post',postRoute)


