import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
}

export const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport(config)
    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.GMAIL,
      to: email,
      subject: title,
      html: body,
    })
    // console.log('Email info: ', info)
    return info
  } catch (error) {
    console.log(error.message)
  }
}
