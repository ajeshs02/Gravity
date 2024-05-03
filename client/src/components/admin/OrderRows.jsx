import { useEffect, useState } from 'react'
import { updateOrderDeliveryDate } from '../../api/admin'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const OrderRows = ({ order, openModal }) => {
  const deliveryDate = order.deliveryDate
    ? order.deliveryDate.split('T')[0]
    : ''
  const [selectedDate, setSelectedDate] = useState(deliveryDate)

  const queryClient = useQueryClient()

  const {
    mutateAsync: updateDateMutation,
    isLoading: isUpdating,
    isPending,
  } = useMutation({
    mutationFn: (data) => updateOrderDeliveryDate(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['AdminFetchOrders'], {
        exact: true,
      })
    },
  })

  const handleDateChange = async (e) => {
    const date = e?.target?.value
    if (date) {
      setSelectedDate(date)
      await handleUpdateDeliveryDate(order._id, date)
    }
  }

  const handleUpdateDeliveryDate = async (orderId, date) => {
    try {
      await updateDateMutation({ orderId, deliveryDate: date })
    } catch (error) {
      alert('Date update failed')
      console.error(error)
    }
  }

  return (
    <tr
      key={order._id}
      className="border-b border-gray-200 dark:border-gray-700  hover:bg-blue-50"
    >
      <td className="px-6 py-4 text-center border-r">{order.user.name}</td>
      <td className="px-6 py-4 text-center min-w-44 border-r">
        {order.shippingAddress.addressDetails.address},{' '}
        {order.shippingAddress.addressDetails.street},{' '}
        {order.shippingAddress.addressDetails.city},{' '}
        {order.shippingAddress.addressDetails.state} -{' '}
        {order.shippingAddress.addressDetails.pin}
      </td>
      <td className="px-6 py-4 text-center border-r ">
        <div className=" flex flex-col flex-center whitespace-nowrap">
          {order.items.length} items
          <span
            className="cursor-pointer text-uAccent"
            onClick={() => openModal(order)}
          >
            view
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center border-r ">{order.totalPrice}</td>
      <td
        className={`px-6 py-4 text-center border-r ${
          !order.deliveryDate && 'text-red-500'
        }`}
      >
        {isUpdating || isPending ? (
          'updating...'
        ) : (
          <div className="z-10 ">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e)}
              min={new Date().toISOString().split('T')[0]}
              className="bg-transparent cursor-pointer"
            />
          </div>
        )}
      </td>
      <td
        className={`px-6 py-4 text-center ${
          order.paymentStatus === 'completed' ? 'text-uAccent' : 'text-red-600'
        } `}
      >
        {order.paymentStatus}
      </td>
    </tr>
  )
}

export default OrderRows
