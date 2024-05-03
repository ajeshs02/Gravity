import { Outlet } from 'react-router-dom'
import AdminNavbar from '../components/navbar/AdminNavbar'
import LazyLoader from '../components/common/LazyLoader'
import { adminNavbarLinks } from '../constants/constants'
import { Suspense } from 'react'
const AdminLayout = () => {
  return (
    <div className="mt-24 wrapper">
      <AdminNavbar navbarLinks={adminNavbarLinks} />
      <main>
        <Suspense fallback={<LazyLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default AdminLayout
