import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Product name required'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: { type: String, required: true },
  description: {
    type: String,
    trim: false,
    required: [true, 'Product description required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price required'],
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
  ],

  discount: { type: Number, default: 0 },
  stock: {
    type: Number,
    required: [true, 'Please Enter product Stock'],
    maxLength: [4, 'Stock cannot exceed 4 characters'],
    default: 1,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },
  avgRating: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  softDelete: {
    type: Boolean,
    default: false,
  },
})

const Product = mongoose.model('Product', productSchema)
export default Product
