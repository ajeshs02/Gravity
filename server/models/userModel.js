import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minLength: [3, 'Name should contain at least 4 characters'],
      maxLength: [30, 'Name cannot exceed 30 characters'],
    },
    image: {
      url: {
        type: String,
        default:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      },
      public_id: {
        type: String,
        default: '',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
    },
    mobile: {
      type: String,
      // unique: [true, 'This mobile number already exists'],
    },
    password: {
      type: String,
      required: [true, 'Please Enter Your Password'],
      minLength: [6, 'Password should contain at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExp: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// encrypt password before saving to database(using bcrypt hash())
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10)
})

// password comparing methods
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
