import { motion } from 'framer-motion'
import { IoMdCloseCircle } from 'react-icons/io'

const OrderDetailsModal = ({ closeModal, selectedOrder }) => {
  const {
    totalPrice,
    status,
    createdAt: date,
    deliveryDate: delivery,
    items,
    paymentStatus,
    _id,
    shippingAddress,
  } = selectedOrder
  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="w-11/12 sm:w-8/12 md:w-7/12 lg:w-5/12 h-[80vh] r p-5 flex flex-col bg-primary rounded-md "
      >
        <div className="flex relative flex-col w-full h-full p-2 px3 items-center justify-start  ">
          <div
            className="absolute p-1 scale-125 hover:shadow-xl cursor-pointer rounded-full right-1 top-1 bg-accent"
            onClick={() => closeModal()}
          >
            <IoMdCloseCircle className="text-uAccent scale-150" />
          </div>

          <h1 className="text-center text-xl lg:text-2xl font-semibold mb-5">
            Order Details
          </h1>
          <div className="flex flex-col w-full h-full p-2 font-medium gap-y-5 overflow-hidden  overflow-y-auto">
            {/* product image /name/price map() */}
            <div className="  min-h-[6rem] max-h-fit rounded-md border py-3 border-uAccent/50 bg-white overflow-y-auto">
              {items.map((product, i) => (
                <div
                  key={i}
                  className="flex w-full justify-around items-center h-14  py-1 "
                >
                  <div className="h-full">
                    <img
                      src={product.product.images[0].url}
                      className="aspect-square h-full object-contain"
                      alt="product image"
                    />
                  </div>
                  <h1 className="max-md:text-sm text-left">
                    {product.product.name}
                  </h1>
                  <h1 className="max-md:text-sm text-left">
                    {product.product.price}/-
                  </h1>
                  <h1 className="max-md:text-sm text-left">
                    Qty: {product.quantity}
                  </h1>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              ordered on: <p>{new Date(date).toLocaleDateString()}</p>
            </div>
            <div className={`flex justify-between  `}>
              expected delivery:{' '}
              <p>
                {' '}
                {delivery === null
                  ? 'update soon'
                  : new Date(delivery).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-between">
              total amount:{' '}
              <div className="flex">
                <p>{totalPrice}/-</p>
              </div>
            </div>
            <div className="flex justify-between">
              Payment Status:{' '}
              <div className="flex">
                <p>{paymentStatus}/-</p>
              </div>
            </div>
            <div className="flex justify-between">
              address:{' '}
              <p className="ml-6 h-auto text-right">
                {shippingAddress.addressDetails.address},{' '}
                {shippingAddress.addressDetails.city}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
export default OrderDetailsModal
