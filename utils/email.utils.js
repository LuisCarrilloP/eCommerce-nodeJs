/* const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
const pug = require("pug")
const path = require("path")
const { htmlToText } = require("html-to-text")

dotenv.config({ path: "./confif.env" })

class Email{
    constructor(){

    }

    //Connect to mail service
    newTransport(){
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
    async send(){
        const html = pug.renderFile(
            path.join(__dirname, " ", "views", "emails", "base.pug"),
            {
                title: "My first mail", => 
            }
        )
    }
} */