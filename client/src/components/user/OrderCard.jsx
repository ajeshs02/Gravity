import { useState } from 'react'
import OrderCancelModal from './OrderCancelModal'

const OrderCard = ({ order, openModal }) => {
  const {
    totalPrice,

    createdAt: date,
    deliveryDate: delivery,
    items,
    paymentStatus,
    _id,
  } = order
  const [confirmModal, setConfirmModal] = useState(false)

  return (
    <article
      className={`flex max-h-fit max-sm:pr-4 cursor-pointer h-32  mb-3 rounded-lg border-violet-100 p-2 border  overflow-hidden transition-all justify-between w-full lg:w-[90%] xl:w-[80%] bg-secondary shadow-md`}
    >
      {/* left */}
      {confirmModal && (
        <OrderCancelModal setConfirmModal={setConfirmModal} id={_id} />
      )}

      {items.length > 0 && (
        <div
          className={`w-1/6 grid ${
            items.length === 1
              ? 'grid-cols-1'
              : items.length === 2
              ? 'grid-cols-2'
              : items.length === 3
              ? 'grid-cols-2'
              : items.length === 4 && '2'
          }
          ${
            items.length === 1
              ? 'grid-rows-1'
              : items.length === 2
              ? 'grid-rows-1'
              : items.length === 3
              ? 'grid-rows-2'
              : items.length === 4 && 'grid-rows-2'
          }
            bg-white justify-center rounded-md h-full p-2`}
          onClick={() => {
            openModal(order)
          }}
        >
          {items.slice(0, 4).map((item, i) => (
            <div
              key={i}
              className="w-full flex justify-center items-center h-full"
            >
              <img
                src={item.product.images[0].url}
                alt="cart product image"
                className="object-contain max-h-full max-w-full"
              />
            </div>
          ))}
        </div>
      )}
      {/* middle */}
      <div
        className="flex ml-3  lg:text-base  font-medium  justify-around h-full items-start mr-auto  flex-col w-4/6 text-sm  p-3"
        onClick={() => {
          openModal(order)
        }}
      >
        <div className="flex flex-col">
          <div className="flex">
            total price: &nbsp;{' '}
            <p className="text-blue-500">
              {totalPrice.toLocaleString('en-IN')}/-
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex  whitespace-nowrap">
              Payment Status: &nbsp;{' '}
              <p className={`text-blue-500 `}>{paymentStatus}</p>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col ${
            status === 'Cancelled' && 'hidden'
          } lg:flex-row lg:gap-x-10`}
        >
          <div className="flex">
            ordered on: &nbsp;{' '}
            <p className="text-blue-500">
              {new Date(date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex">
            expected delivery: &nbsp;{' '}
            <p className="text-blue-500">
              {delivery === null
                ? 'update soon..'
                : new Date(delivery).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      {/* right */}
      <div
        className={`w-1/6 hidden  rounded-lg justify-center items-center gap-y-3`}
      >
        <button
          className="items-center justify-center rounded-md bg-white border border-red-500  px-5 mx-3 py-2.5 text-center text-sm  text-red-500   font-bold hover:text-white hover:bg-red-600 whitespace-pre-wrap transition-all active:scale-95 "
          onClick={() => setConfirmModal(true)}
        >
          cancel order
        </button>
      </div>
    </article>
  )
}
export default OrderCard
