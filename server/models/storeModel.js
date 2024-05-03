import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const storeSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
    },
    password: {
      type: String,
      required: [true, 'Please Enter Your Password'],
      minLength: [6, 'Password should contain at least 6 characters'],
      select: false,
    },
    image: {
      url: {
        type: String,
        default:
          'https://cdn.pixabay.com/photo/2014/04/02/10/47/symbol-304595_1280.png',
      },
      public_id: {
        type: String,
        default: '',
      },
    },
    cloudinary_id: {
      type: String,
    },
    mobile: {
      type: String,
      // unique: [true, 'This mobile number already exists'],
    },
    description: {
      type: String,
      default:
        'Welcome to our store! Browse through our wide selection of products and find exactly what you are looking for',
    },
    role: {
      type: String,
      default: 'seller',
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cash_on_delivery'],
      default: 'cash_on_delivery',
      required: true,
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
storeSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10)
})

// password comparing methods
storeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const Store = mongoose.model('Store', storeSchema)
export default Store
