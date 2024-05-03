import mongoose from 'mongoose'
import { mailSender } from '../utils/nodemailer.js'

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
})

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      'Verification Email',
      `<h2>Please confirm your Gravshop OTP</h1>
       <h3>Here is your OTP code: ${otp}</h3>`
    )
    // console.log('Email sent successfully: ', mailResponse)
  } catch (error) {
    console.log('Error occurred while sending email: ', error)
    throw error
  }
}

otpSchema.pre('save', async function (next) {
  // console.log('New document saved to the database')
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp)
  }
  next()
})

const OTP = mongoose.model('otp', otpSchema)
export default OTP
