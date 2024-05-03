import { useQuery } from '@tanstack/react-query'
import { fetchStoreOrders } from '../../api/store'
import { LuPackage } from 'react-icons/lu'
import CartSkelton from '../../components/skelton/CartSkelton'
import StoreOrderCard from '../../components/store/StoreOrderCard'
import SEO from '../../Seo'

const StoreOrdersPage = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['storeOrders'],
    queryFn: fetchStoreOrders,
  })

  return (
    <section className="mx-1 md:mx-10 min-h-fit max-md:mb-40">
      {isLoading ? (
        <>
          <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-sAccent mb-5 pl-5">
            <SEO
              title={'Store Orders Page'}
              description={'This is store orders page'}
            />
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
            title={'Store Orders Page'}
            description={'This is store orders page'}
          />
          <div className={`sm:w-full ${true && 'sm:w-2/3'} w-full `}>
            <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex gap-x-3 items-center text-sAccent mb-5 pl-5">
              Orders <LuPackage className="scale-125" />
            </div>

            {/* {console.log(myOrders)} */}
            {!isLoading && orders.length > 0 ? (
              orders.map((order, i) => <StoreOrderCard order={order} key={i} />)
            ) : (
              <div className="w-full h-96  flex flex-col items-center justify-center text-xl font-medium text-gray-700">
                No Orders Yet!
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
export default StoreOrdersPage
