const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
const pug = require("pug")
const path = require("path")
const { htmlToText } = require("html-to-text")

dotenv.config({ path: "./confif.env" })

class Email{
    constructor(to){
        this.to = to
    }

    //Connect to mail service
    newTransport(){
        if(process.env.NODE_ENV === "production"){ //cambiar a development para probar envio de correo
            return nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: "apikey",
                    pass: process.env.SENDGRID_API_KEY
                } 
            })
        }

        return nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD
            } 
        })
    }

    //Send the actual mail
    async send(template, subject, mailData){
        const html = pug.renderFile(
            path.join(__dirname, "..", "views", "email", `${template}.pug`),
            mailData
        )

        await this.newTransport().sendMail({
            from: process.env.MAIL_FROM,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)
        })
    }

    async sendWelcome(name){
        await this.send("welcome", "Welcome to our app", { name })
    }

    async sendPurchase(totalPrice, /* sessionUser.name */ newOrder){
        await this.send("purchase", "Your recent order", { totalPrice, /* sessionUser.name */ newOrder, productInCart })
    }
}

module.exports = { Email }