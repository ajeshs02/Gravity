import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import axios from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { HelmetProvider } from 'react-helmet-async'

// authentication
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import StoreOTP from './pages/auth/storeAuth/StoreOTP'
import OTP from './pages/auth/userAuth/OTP'
import ProtectedRoute from './pages/auth/ProtectedRoute'
import AdminLoginPage from './pages/auth/adminAuth/AdminLogin'

// user
import HomePage from './pages/user/HomePage'
const ProductsPage = lazy(() => import('./pages/user/ProductsPage'))
const StoresPage = lazy(() => import('./pages/user/StoresPage'))
const PublicStoreProfile = lazy(() => import('./pages/user/PublicStoreProfile'))
const ProductDetailsPage = lazy(() => import('./pages/user/ProductDetailsPage'))
const OrdersPage = lazy(() => import('./pages/user/OrdersPage'))
const CartPage = lazy(() => import('./pages/user/CartPage'))
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'))
const Categories = lazy(() => import('./pages/user/Categories'))

//store
const StoreHomePage = lazy(() => import('./pages/store/StoreHomePage'))
const StoreProducts = lazy(() => import('./pages/store/StoreProductsPage'))
const StoreProductDetailsPage = lazy(() =>
  import('./pages/store/StoreProductDetailsPage')
)
const StoreOrders = lazy(() => import('./pages/store/StoreOrdersPage'))
const StoreProfile = lazy(() => import('./pages/store/StoreProfilePage'))

//admin
const AdminHomePage = lazy(() => import('./pages/admin/AdminHomePage'))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'))
const AdminStorePage = lazy(() => import('./pages/admin/AdminStorePage'))
const AdminUserPage = lazy(() => import('./pages/admin/AdminUserPage'))

// general
import UserLayout from './pages/UserLayout'
import StoreLayout from './pages/StoreLayout'
import AdminLayout from './pages/AdminLayout'
import NotFound from './pages/user/NotFound'
import StoreNotFound from './pages/store/NotFound'

//context
import { ToastProvider } from './context/ToastContext'
import AdminNotFound from './pages/admin/AdminNotFound'

import UserChatsPage from './pages/user/UserChatsPage'
import UserMessagePage from './pages/user/UserMessagePage'
import { SocketProvider } from './context/SocketContext'
import StoreChatsPage from './pages/store/StoreChatsPage'
import StoreMessagePage from './pages/store/StoreMessagePage'

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/verify-otp',
    element: <OTP />,
  },
  {
    element: <ProtectedRoute role={'user'} />,
    children: [
      {
        element: <UserLayout />,
        errorElement: <NotFound />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/browse/*', element: <ProductsPage /> },
          { path: '/stores', element: <StoresPage /> },
          { path: '/categories', element: <Categories /> },
          { path: '/brand', element: <Categories /> },
          { path: '/store/:storeId', element: <PublicStoreProfile /> },
          { path: '/product/:id', element: <ProductDetailsPage /> },
          { path: '/orders', element: <OrdersPage /> },
          { path: '/cart', element: <CartPage /> },
          { path: '/profile', element: <ProfilePage /> },

          {
            path: '/chats',
            element: (
              <SocketProvider>
                <UserChatsPage />
              </SocketProvider>
            ),
          },
          {
            path: '/message/:conversationId',
            element: (
              <SocketProvider>
                <UserMessagePage />
              </SocketProvider>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/store/verify-otp',
    element: <StoreOTP />,
  },
  {
    element: <ProtectedRoute role={'store'} />,
    children: [
      {
        path: 'store',
        element: <StoreLayout />,
        errorElement: <StoreNotFound />,
        children: [
          { path: '', element: <StoreHomePage /> }, // Changed from '/' to ''
          { path: 'products', element: <StoreProducts /> },
          { path: 'product/:id', element: <StoreProductDetailsPage /> },
          { path: 'orders', element: <StoreOrders /> },
          { path: 'profile', element: <StoreProfile /> },

          {
            path: 'chats',
            element: (
              <SocketProvider>
                <StoreChatsPage />
              </SocketProvider>
            ),
          },
          {
            path: 'message/:conversationId',
            element: (
              <SocketProvider>
                <StoreMessagePage />
              </SocketProvider>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/admin-login',
    element: <AdminLoginPage />,
  },
  {
    element: <ProtectedRoute role={'admin'} />,
    children: [
      {
        path: 'admin',
        element: <AdminLayout />,
        errorElement: <AdminNotFound />,
        children: [
          { path: '', element: <AdminHomePage /> },
          { path: 'stores', element: <AdminStorePage /> },
          { path: 'users', element: <AdminUserPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
        ],
      },
    ],
  },
])

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <RouterProvider router={router} />
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ToastProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
export default App
