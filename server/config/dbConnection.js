import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'gravshop',
    })

    console.log(`MongoDB connected : ${connect.connection.name}`)

    connect.connection.on('error', (err) => {
      console.error(`MongoDB connection error : ${err}`)
    })
  } catch (error) {
    console.error(`Database Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
