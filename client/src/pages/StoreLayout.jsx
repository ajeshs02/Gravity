import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import { storeNavbarLinks, storeSidebarLinks } from '../constants/constants'
import LazyLoader from '../components/common/LazyLoader'
import { Suspense } from 'react'

const StoreLayout = () => {
  return (
    <div className="mt-24 wrapper">
      <Navbar
        navbarLinks={storeNavbarLinks}
        sidebarLinks={storeSidebarLinks}
        user="store"
      />
      <main>
        <Suspense fallback={<LazyLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default StoreLayout
