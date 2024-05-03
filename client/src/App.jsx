import { lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

const queryClient = new QueryClient()

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router>
            <Routes>
              {/* General Routes */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* User Routes*/}
              <Route path="/verify-otp" element={<OTP />} />
              {/* User Protected Route */}
              <Route element={<ProtectedRoute role="user" />}>
                {/* user layout */}
                <Route path="/" element={<UserLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/browse/*" element={<ProductsPage />} />
                  <Route path="/stores" element={<StoresPage />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/brand" element={<Categories />} />
                  <Route
                    path="/store/:storeId"
                    element={<PublicStoreProfile />}
                  />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />

                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>

              {/* Store  Routes */}
              <Route path="/store/verify-otp" element={<StoreOTP />} />
              {/* store layout */}
              <Route element={<ProtectedRoute role="store" />}>
                <Route path="store/" element={<StoreLayout />}>
                  <Route index element={<StoreHomePage />} />
                  <Route path="products" element={<StoreProducts />} />
                  <Route
                    path="product/:id"
                    element={<StoreProductDetailsPage />}
                  />
                  <Route path="orders" element={<StoreOrders />} />
                  <Route path="profile" element={<StoreProfile />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route path="/admin-login" element={<AdminLoginPage />} />
              {/* admin layout */}
              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="admin/*" element={<AdminLayout />}>
                  <Route index element={<AdminHomePage />} />
                  <Route path="stores" element={<AdminStorePage />} />
                  <Route path="users" element={<AdminUserPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                </Route>
              </Route>

              {/* NotFound pages */}
              <Route path="/*" element={<NotFound />} />
              <Route path="/store/*" element={<StoreNotFound />} />
            </Routes>
          </Router>
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
