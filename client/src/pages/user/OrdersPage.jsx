import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import OrderDetailsModal from '../../components/user/OrderDetailsModal'
import OrderCard from '../../components/user/OrderCard'
import CartSkelton from '../../components/skelton/CartSkelton'
import { LuPackage } from 'react-icons/lu'
import { fetchOrders } from '../../api/user'
import SEO from '../../Seo'

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate()

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  })

  const openModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedOrder(null)
    setIsModalOpen(false)
  }

  if (isError) {
    return <h1>Error fetching Orders</h1>
  }
  return (
    <section className="mx-1 md:mx-10 min-h-fit max-md:mb-40">
      {isLoading ? (
        <>
          <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-uAccent mb-5 pl-5">
            My Orders <LuPackage />
          </div>
          {Array(3)
            .fill()
            .map((_, index) => (
              <CartSkelton key={index} />
            ))}
        </>
      ) : (
        <div className="w-full relative px-3 flex justify-center min-h-fit h-full pb-10 gap-x-4 overflow-hidden">
          <SEO
            title={'Gravshop - Orders Page'}
            description={'This is user orders page'}
          />
          <div className={`sm:w-full ${true && 'sm:w-2/3'} w-full `}>
            <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex gap-x-3 items-center text-uAccent mb-5 pl-5">
              My Orders <LuPackage className="scale-125" />
            </div>
            {isModalOpen && selectedOrder && (
              <OrderDetailsModal
                closeModal={closeModal}
                selectedOrder={selectedOrder}
              />
            )}
            {/* {console.log(myOrders)} */}
            {!isLoading && orders.length > 0 ? (
              orders.map((order, i) => (
                <OrderCard order={order} key={i} openModal={openModal} />
              ))
            ) : (
              <div className="w-full h-96  flex flex-col items-center justify-center text-xl font-medium text-gray-700">
                No Orders Yet!
                <Link
                  to={'/'}
                  className="underline text-blue-400 hover:text-uAccent"
                >
                  continue shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
export default OrdersPage
