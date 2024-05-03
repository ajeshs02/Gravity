import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../common/Loading'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { updateCart } from '../../state/slices/cartSlice'
import { deleteCartItem } from '../../state/slices/cartSlice'
import { AiFillDelete } from 'react-icons/ai'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCartItemQuantity, deleteItemFromCart } from '../../api/user'

const CartCard = ({ product }) => {
  // console.log(product)
  const { _id, name, price, images } = product.product

  const quantity = product.quantity

  const dispatch = useDispatch()

  const queryClient = useQueryClient()

  const { mutateAsync: updateCartQtyMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: updateCartItemQuantity,
      onSuccess: () => {
        queryClient.invalidateQueries(['cart'], { exact: true })
      },
    })
  const { mutateAsync: deleteCartProductMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteItemFromCart,
      onSuccess: () => {
        queryClient.invalidateQueries(['cart'])
      },
    })

  const qtyClass =
    'w-8 h-7 text-xl  text-center flex items-center justify-center rounded-md font-semibold  bg-uAccent text-white active:scale-95 transition-all'

  const updateQty = async (act) => {
    try {
      await updateCartQtyMutation({ productId: _id, action: act })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteProduct = async () => {
    try {
      await deleteCartProductMutation({ productId: _id })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <article
      className={`flex max-h-fit bg-violet-50 cursor-pointer h-28 max-sm:h-32 mb-3 rounded-lg border-violet-100 p-2 border  transition-all justify-between w-full lg:w-[90%] xl:w-[80%] text-sm ${
        isUpdating && 'cursor-wait'
      }`}
    >
      {/* left */}
      {/* {isUpdating && <Loading />} */}
      {images.length > 0 && (
        <Link
          to={`/product/${_id}`}
          className="w-1/5 flex bg-white justify-center rounded-md h-full p-2"
        >
          <img
            src={images[0].url}
            alt="cart product image"
            className="object-contain max-h-full"
          />
        </Link>
      )}
      {/* middle */}
      <div className="flex ml-3 items-start mr-auto  flex-col w-3/6 border-r  p-3">
        {/* middle top */}
        <Link to={`/product/${_id}`}>
          <p className="text-xl max-md:text-base font-medium   my-auto ">
            {name}
          </p>
        </Link>
        {/* middle bottom */}
        <div className="flex gap-x-12 max-md:gap-x-5 h-8 mt-auto w-full  ">
          <div
            className={`flex justify-between w-28 rounded bg-gray-200  items-center `}
          >
            {/* quantity button */}
            <button
              aria-label="decrease quantity"
              className={`${qtyClass} ${
                quantity <= 1 && 'cursor-not-allowed'
              } ${isUpdating && 'cursor-progress'}`}
              disabled={quantity <= 1 || isUpdating}
              onClick={() => updateQty('dec')}
            >
              -
            </button>
            <p className="w-3/4 text-center font-medium">Qty: {quantity}</p>
            <button
              aria-label="increase quantity"
              className={`${qtyClass} ${isUpdating && 'cursor-progress'}`}
              disabled={isUpdating}
              onClick={() => updateQty('inc')}
            >
              +
            </button>
          </div>
          <button
            aria-label="delete cart item"
            onClick={deleteProduct}
            disabled={isUpdating}
            className={`transition-transform hover:scale-105 rounded-lg active:scale-95 ${
              isDeleting || (isUpdating && 'cursor-progress')
            }`}
          >
            <AiFillDelete className="scale-150 text-red-500" />
          </button>
        </div>
      </div>
      {/* right */}
      <div className="w-[25%] lg:w-1/6 flex flex-col whitespace-nowrap bg-violet-100 rounded-lg justify-center items-center gap-y-3">
        <div className="text-md text-gray-700 font-medium">
          {quantity} x {price}
        </div>
        <div className="text-lg md:text-xl font-semibold">
          {(quantity * price).toLocaleString('en-IN')}/-
        </div>
      </div>
    </article>
  )
}
export default CartCard
