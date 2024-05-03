import axios from 'axios'

export const initPay = async (data, navigate, setIsLoading, toast) => {
  const options = {
    key: import.meta.env.VITE_RZP_ID,
    amount: data.totalPrice,
    currency: 'INR',
    name: `Total ${data.items.length} products`,
    order_id: data.razorpayOrderId,
    handler: async (response) => {
      try {
        setIsLoading(true)
        const verifyURL = '/user/payment/verify'
        const { data } = await axios.post(verifyURL, response)
        setIsLoading(false)
        toast('success', 'Payment successful')
        navigate('/orders')
      } catch (error) {
        toast('error', 'Payment failed')
        console.log(error)
        setIsLoading(false)
      }
    },
    onClose: () => {
      alert('Payment Failed')
    },
    theme: {
      color: '#3399cc',
    },
  }
  const rzp1 = new window.Razorpay(options)
  rzp1.open()
}
