import handleAsync from "async-error-handler";
import {createTestAccount,createTransport,getTestMessageUrl} from 'nodemailer'
import { env } from "../index.js";

export const sendMail = handleAsync(async(data,req,res,next)=>{
    
    let testAccount = await createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: env.NODE_MAILER_USER, // generated ethereal user
            pass: env.NODE_MAILER_PASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@gamil.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: data.html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

},(err,req,res,next)=>{
    next(err);
})