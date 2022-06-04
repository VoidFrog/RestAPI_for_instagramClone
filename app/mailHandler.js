const nodemailer = require('nodemailer')
const tokenAuth = require('./tokenAuth.js')

const config = {
    host: "smtp.mail.yahoo.com",
    port: 465, // 587
    service: 'Yahoo',
    secure: false,
    //secure: true, // SSL 
    auth: {
        user: process.env.YAHOO_LOGIN,
        pass: process.env.YAHOO_PASS
    }
}

const transporter = nodemailer.createTransport(config)

async function send_mail(user){
    let token = await tokenAuth.create_token(user)

    transporter.sendMail({
        from: `${process.env.YAHOO_LOGIN}`,
        to: user.email,
        subject: 'account confirmation',
        text: 'please confirm your accont',
        html: `<center><h1>ACCOUNT CONFIRMATION</h1></center><br><p>to confirm your new account please click the following link</p><p>http://localhost:3000/api/user/confirm/${token}</p>`
    })
}

async function send_confirmation(user){
    transporter.sendMail({
        from: `${process.env.YAHOO_LOGIN}`,
        to: user.email,
        subject: 'account confirmed',
        text: 'confirmation successful',
        html: `<center><h1>ACCOUNT CONFIRMED</h1></center><br><p>Now you can log in and use the app <3</p>`
    })
}

module.exports = { send_mail, send_confirmation }