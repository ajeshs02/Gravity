import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from './config/dbConnection.js'
import { userRouter } from './routes/user/userRoutes.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import { storeRouter } from './routes/store/storeRoutes.js'
import { productCategoryRouter } from './routes/store/categoryRoutes.js'
import { storeProductRouter } from './routes/store/storeProductRoutes.js'
import { userStoreRouter } from './routes/user/userStoreRoutes.js'
import { userCartRouter } from './routes/user/cartRoutes.js'
import { userAddressRouter } from './routes/user/addressRoutes.js'
import { userPaymentRouter } from './routes/user/paymentRoutes.js'
import { userOrdersRouter } from './routes/user/ordersRoutes.js'
import { storeOrderRoutes } from './routes/store/storeOrderRoutes.js'
import { userProductRouter } from './routes/user/productRoutes.js'
import { storeDashboardRouter } from './routes/store/storeDashboardRoutes.js'
import { adminUserRouter } from './routes/admin/adminUserRoutes.js'
import { adminStoreRouter } from './routes/admin/adminStoreRoutes.js'
import { adminOrderRouter } from './routes/admin/adminOrdersRoutes.js'
import { adminDashboardRouter } from './routes/admin/adminDashboardRoutes.js'
import { adminRouter } from './routes/admin/adminRoutes.js'
import { app, server } from './socket/socket.js'
import { userMessageRoute } from './routes/user/userMessageRoutes.js'
import { storeMessageRoute } from './routes/store/storeMessageRoutes.js'
import { storeUserRouter } from './routes/store/storeUserRoutes.js'

//for database connection
connectDB()

const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://gravity-3xtg.onrender.com'],
  })
)

// user routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/user/product', userProductRouter)
app.use('/api/v1/user/store', userStoreRouter)
app.use('/api/v1/user/cart', userCartRouter)
app.use('/api/v1/user/address', userAddressRouter)
app.use('/api/v1/user/payment', userPaymentRouter)
app.use('/api/v1/user/orders', userOrdersRouter)
app.use('/api/v1/user', userMessageRoute)

// store routes
app.use('/api/v1/store', storeRouter)
app.use('/api/v1/store/category', productCategoryRouter)
app.use('/api/v1/store/product', storeProductRouter)
app.use('/api/v1/store/orders', storeOrderRoutes)
app.use('/api/v1/store/dashboard', storeDashboardRouter)
app.use('/api/v1/store/user', storeUserRouter)
app.use('/api/v1/store/', storeMessageRoute)

//admin routes
app.use('/api/v1/admin/', adminRouter)
app.use('/api/v1/admin/users', adminUserRouter)
app.use('/api/v1/admin/dashboard', adminDashboardRouter)
app.use('/api/v1/admin/stores', adminStoreRouter)
app.use('/api/v1/admin/orders', adminOrderRouter)

//error handling middleware
app.use(notFound)
app.use(errorHandler)

//server starting on specified port
server.listen(port, () => {
  console.log(`Server is listening to port ${port}`)
})
