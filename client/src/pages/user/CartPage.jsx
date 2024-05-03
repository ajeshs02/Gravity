import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { handlePay, viewCart } from '../../api/user'
import CartSkelton from '../../components/skelton/CartSkelton'
import { IoMdCart } from 'react-icons/io'
import CartCard from '../../components/user/CartCard'
import { useQuery } from '@tanstack/react-query'
import AddressModal from '../../components/user/AddressModal'
import { initPay } from '../../utils/razorpay'
import SEO from '../../Seo'
import { useToast } from '../../context/ToastContext'

const CartPage = () => {
  const [addressModal, setAddressModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const toast = useToast()

  const {
    data: cart,
    isLoading: isCartLoading,
    isError,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: () => viewCart(),
  })

  const checkStock = async () => {
    // try {
    //   const { data } = await axios.get('/products/stock')
    //   // console.log(data)
    //   if (data.success) {
    //     return data
    //   } else {
    //     return data
    //   }
    // } catch (error) {
    //   console.error(error)
    // }
  }

  const handlePayment = async () => {
    const data = await handlePay(false)
    toast('info', 'Payment Processing, Dont try to close the page ')
    await initPay(data.savedOrder, navigate, setIsLoading, toast)
  }

  // useEffect(() => {
  //   console.log(cart)
  // }, [isCartLoading])

  if (isError) {
    return <h1>Error fetching cart</h1>
  }

  return (
    <section
      className={`${
        isLoading && 'cursor-wait'
      } mx-1 md:mx-10 min-h-fit max-md:mb-40`}
    >
      <SEO
        title={'Gravshop - Cart Page'}
        description={'This is user cart page'}
      />
      {isCartLoading ? (
        <>
          <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-uAccent mb-5 pl-5">
            My Cart <IoMdCart className="scale-125" />
          </div>
          {Array(3)
            .fill()
            .map((_, index) => (
              <CartSkelton key={index} />
            ))}
        </>
      ) : (
        <>
          <div className="w-full relative px-3 flex justify-center min-h-fit h-full pb-10 gap-x-4 overflow-hidden">
            <div className={`sm:w-full ${true && 'sm:w-2/3'} w-full `}>
              <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-uAccent mb-5 gap-x-3 pl-5">
                My Cart <IoMdCart className="scale-125" />
              </div>
              {cart.products.length > 0 ? (
                cart.products.map((product, i) => (
                  <CartCard product={product} key={i} />
                ))
              ) : (
                <div className="w-full h-96  flex flex-col items-center justify-center text-xl font-medium text-gray-700">
                  No items in your cart!
                  <Link
                    to={'/'}
                    className="underline text-violet-400 hover:text-uAccent"
                  >
                    continue shopping
                  </Link>
                </div>
              )}
            </div>
            {addressModal && (
              <AddressModal
                makePayment={handlePayment}
                setAddressModal={setAddressModal}
                isPaymentLoading={isLoading}
              />
            )}
            {/* right */}
            {cart.products.length > 0 && (
              <div className="max-lg:hidden mt-16 w-56 min-w-[14rem]  flex relative top-4 h-60 flex-col text-lg  justify-between rounded-md shadow-lg p-2  whitespace-nowrap bg-violet-100 ">
                <div className="my-auto flex flex-col gap-y-3">
                  <div className="flex w-full justify-between">
                    total items:{' '}
                    <p className="text-lg font-bold mr-3">
                      {cart.totalQuantity}
                    </p>
                  </div>
                  <div className="flex  w-full justify-between">
                    total :{' '}
                    <div className="flex flex-col gap-y-2">
                      <p className={`text-lg font-bold `}>
                        {cart.totalPrice.toLocaleString('en-IN')}/-
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full h-10 mt-auto flex justify-center bg-uAccent  items-center text-lg shadow-md  rounded text-gray-200 transition-all active:scale-95 hover:text-white   "
                  onClick={() => {
                    setAddressModal(true)
                  }}
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* mobile fixed */}
            {cart.products.length > 0 && (
              <div className="hidden max-lg:flex gap-x-5 fixed bottom-3 right-4 left-4 h-20 rounded-md border bg-violet-100 py-2 shadow-xl">
                {/* left */}
                <div className="w-3/5 flex text-lg flex-col justify-center items-center p-3">
                  <div className="flex w-full border-black justify-start gap-x-5">
                    total items:{' '}
                    <p className="mr-3 font-medium">{cart.totalQuantity}</p>
                  </div>

                  <div className="flex   w-full justify-start gap-x-4">
                    total price:{' '}
                    <div>
                      <p className={`text-lg font-semibold`}>
                        {cart.totalPrice.toLocaleString('en-IN')}/-
                      </p>
                    </div>
                  </div>
                </div>
                {/* wallet checkbox */}

                {/* right */}
                <button
                  className="w-1/5 ml-auto h-full m-2 my-2 mt-auto flex justify-center bg-uAccent  items-center text-lg max-sm:text-base shadow-md  rounded text-white hover:text-white  transition-all active:scale-95  hover:shadow-lg"
                  onClick={() => {
                    setAddressModal(true)
                  }}
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}
export default CartPage
