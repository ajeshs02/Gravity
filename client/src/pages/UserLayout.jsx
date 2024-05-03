import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import { userNavbarLinks, userSidebarLinks } from '../constants/constants'
import { Suspense } from 'react'
import LazyLoader from '../components/common/LazyLoader'
import { ToastContainer } from 'react-toastify'

const UserLayout = () => {
  const location = useLocation()
  const page = location.pathname

  const isSubNavbarVisible = () => {
    if (
      page === '/' ||
      page === '/browse' ||
      page === '/stores' ||
      page === '/categories' ||
      page === '/brand'
    ) {
      return true
    }
    return false
  }

  return (
    <div
      className={`${
        isSubNavbarVisible() ? 'mt-32 ' : 'mt-20 '
      }  wrapper h-full`}
    >
      <Navbar navbarLinks={userNavbarLinks} sidebarLinks={userSidebarLinks} />
      <main className="h-full">
        <Suspense fallback={<LazyLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default UserLayout
