import { useEffect, useState } from 'react'
import MostSoldProduct from '../../components/admin/dashboard/MostSold'
import TotalUsers from '../../components/admin/dashboard/TotalUsers'
import IncomePerMonth from '../../components/admin/dashboard/IncomePerMonth'
import SalesPerCategory from '../../components/admin/dashboard/SalesPerCategory'
import SEO from '../../Seo'

const AdminHomePage = () => {
  return (
    <section className="p-2 w-full min-h-screen pb-10">
      <SEO
        title={'Admin - Dashboard '}
        description={
          'This is the admin dashboard page to see various stats related to the gravshop '
        }
      />
      <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 shadow-md rounded-md bg-secondary">
          <h2 className="text-xl font-semibold mb-2">
            Total Income -{' '}
            {new Date().toLocaleString('default', { month: 'long' })}
          </h2>
          <IncomePerMonth />
        </div>
        <div className="p-4 shadow-md rounded-md bg-secondary min-h-32">
          <TotalUsers />
        </div>
        <div className="p-4 shadow-md rounded-md bg-secondary">
          <h2 className="text-xl font-semibold mb-2">Most Sold Product</h2>
          <MostSoldProduct />
        </div>

        <div className="p-4 shadow-md rounded-md bg-secondary">
          <h2 className="text-xl font-semibold mb-2">Sales Per Category</h2>
          <SalesPerCategory />
        </div>
      </div>
    </section>
  )
}

export default AdminHomePage
