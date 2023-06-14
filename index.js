import {config} from 'dotenv'
import { mainApp } from './app.js'
import chalk from 'chalk'
import { dbConnect } from './DB/dbConnection.js'
import { ErrorLogger,ErrorHandler } from './Utils/errorHandler.js'

config({
    'path':'./config/config.env'
})

export const env= process.env

await dbConnect()


mainApp.use([ErrorLogger,ErrorHandler])

mainApp.listen(env.PORT,()=>{console.log(chalk.bold(chalk.blueBright(`Server running on ${env.PORT}`)));})

