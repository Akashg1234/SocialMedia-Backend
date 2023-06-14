import {connect,Schema,model} from "mongoose"
import { env } from "../index.js"
import chalk from "chalk"

export const dbConnect = async()=>{
    try {
        console.log(chalk.bold(chalk.magenta(`trying to connect to DB.... `)));

        await connect(env.MONGO_DB_URL)

        console.log(chalk.bold(chalk.green(`DB connected.... !`)));

    } catch (error) {
        console.log(chalk.bold(chalk.redBright(error)))
    }
}

export {Schema,model}