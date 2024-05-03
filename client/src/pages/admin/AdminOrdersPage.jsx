import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchOrders, updateOrderDeliveryDate } from '../../api/admin'
import { useEffect, useState } from 'react'
import { Pagination } from '@mui/material'
import AdminOrderDetailsModal from '../../components/admin/AdminOrderDetailsModal'

import OrderRows from '../../components/admin/OrderRows'
import SEO from '../../Seo'

const AdminOrdersPage = () => {
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const {
    data,
    isLoading: isOrdersLoading,
    isError,
  } = useQuery({
    queryKey: ['AdminFetchOrders', page],
    queryFn: () => fetchOrders(page),
  })

  const openModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedOrder(null)
    setIsModalOpen(false)
  }

  if (isError) return <div>Error Loading Orders..</div>

  return (
    <section className="mx-1 md:mx-10 min-h-[80vh] h-auto max-md:mb-20 relative pb-6 ">
      <SEO
        title={'Admin Orders Page'}
        description={'This is admin orders page'}
      />
      <div className="w-full relative px-3 flex justify-center min-h-full h-full items-center  pb-10 gap-x-4 ">
        <div
          className={`sm:w-full ${
            true && 'sm:w-2/3'
          } w-full relative z-0 overflow-x-auto min-h-fit h-full shadow-md sm:rounded-lg my-auto `}
        >
          <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-uAccent mb-5 gap-x-3 pl-5">
            Orders
          </div>
          {isModalOpen && selectedOrder && (
            <AdminOrderDetailsModal
              closeModal={closeModal}
              selectedOrder={selectedOrder}
            />
          )}
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100   dark:bg-gray-800"
                >
                  User Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100   dark:bg-gray-800"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100   dark:bg-gray-800"
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100   dark:bg-gray-800"
                >
                  Total Price
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100   dark:bg-gray-800"
                >
                  Delivery Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100   dark:bg-gray-800"
                >
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className=" w-full">
              {isOrdersLoading ? (
                <tr className="w-full text-center h-[130px] flex flex-col items-center justify-center text-xl font-medium  text-gray-700">
                  <td className="px-6 py-4 ">Loading...</td>
                </tr>
              ) : data?.length > 0 ? (
                data.map((order) => (
                  <OrderRows
                    key={order._id}
                    order={order}
                    openModal={openModal}
                  />
                ))
              ) : (
                <tr className="w-full h-[130px] flex flex-col items-center justify-center text-center mx-auto text-xl font-medium text-gray-700">
                  <td colSpan="7" className="px-6 py-4  w-full text-center ">
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex  justify-center absolute bottom-3">
        <Pagination
          count={data?.totalPages || 1}
          page={page}
          onChange={(event, value) => {
            setPage(value)
            window.scrollTo(0, 0)
          }}
        />
      </div>
    </section>
  )
}

export default AdminOrdersPage
