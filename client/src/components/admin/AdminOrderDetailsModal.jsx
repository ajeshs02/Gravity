import { motion } from 'framer-motion'
import { IoMdCloseCircle } from 'react-icons/io'

const AdminOrderDetailsModal = ({ closeModal, selectedOrder }) => {
  const {
    user,
    items,
    totalPrice,

    paymentStatus,
    deliveryDate,
  } = selectedOrder

  return (
    <div className="fixed  top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="w-9/12 sm:w-3/5 md:w-6/12 lg:w-4/12 h-[80vh] r p-5 flex flex-col bg-primary rounded-md overflow-y-auto"
      >
        <div className="flex relative flex-col w-full h-full p-2 px3 items-center justify-start">
          <div
            className="absolute p-1 scale-125 hover:shadow-xl cursor-pointer rounded-full right-1 top-1 bg-accent"
            onClick={() => closeModal()}
          >
            <IoMdCloseCircle className="text-uAccent scale-150" />
          </div>

          <h1 className="text-center text-xl lg:text-2xl font-semibold mb-5">
            Order Details
          </h1>

          {/* User Details */}
          <div className="flex justify-between w-full mb-4">
            <div>User Name:</div>
            <div>{user.name}</div>
          </div>

          {/* Total Price */}
          <div className="flex justify-between w-full mb-4">
            <div>Total Price:</div>
            <div>{totalPrice}</div>
          </div>

          {/* Payment Status */}
          <div className="flex justify-between w-full mb-4">
            <div>Payment Status:</div>
            <div>{paymentStatus}</div>
          </div>

          {/* Delivery Date */}
          <div className="flex justify-between w-full mb-4">
            <div>Delivery Date:</div>
            <div>
              {deliveryDate
                ? new Date(deliveryDate).toLocaleDateString()
                : 'Not Updated'}
            </div>
          </div>
          {/* Items Details */}
          <h1 className="text-center font-bold mb-1">Ordered Items</h1>
          <div className="w-full h-full flex  flex-col gap-y-3  max-h-full overflow-y-auto p-1 rounded-xl border border-black/50">
            {items.map((item, index) => (
              <div
                key={item.product._id}
                className="flex w-full flex-col h-fit  px-2 rounded-lg bg-blue-200 p-1"
              >
                <div className="flex justify-between w-full border-b">
                  <div>Product ID:</div>
                  <div>{item.product._id}</div>
                </div>
                <div className="flex justify-between w-full border-b ">
                  <div>Product Name:</div>
                  <div>{item.product.name}</div>
                </div>
                <div className="flex justify-between w-full border-b ">
                  <div>Brand:</div>
                  <div>{item.product.brand}</div>
                </div>
                <div className="flex justify-between w-full border-b ">
                  <div>Category:</div>
                  <div>{item.product.category}</div>
                </div>
                <div className="flex justify-between w-full border-b ">
                  <div>Price:</div>
                  <div>{item.product.price}</div>
                </div>
                <div className="flex justify-between w-full border-b ">
                  <div>Quantity:</div>
                  <div>{item.quantity}</div>
                </div>
                <div className="flex justify-between items-center w-full ">
                  <div>Images:</div>
                  <img
                    src={item.product.images[0].url}
                    alt={`Product ${item.product.name} - Image `}
                    className="w-12 h-12 object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminOrderDetailsModal
