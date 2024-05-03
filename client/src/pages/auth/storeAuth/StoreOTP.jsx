import { useState, useEffect } from 'react'
import { registerStore, sendStoreOTP } from '../../../api/auth'
import { useNavigate } from 'react-router-dom'
import StoreRegister from './StoreRegister'
import StoreLogin from './StoreLogin'
import { useSelector, useDispatch } from 'react-redux'
import { setLoginPage, setPage } from '../../../state/slices/formSlice'
import SEO from '../../../Seo'
import { useToast } from '../../../context/ToastContext'

const StoreOTP = () => {
  const dispatch = useDispatch()

  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(60)
  const [isResendDisabled, setIsResendDisabled] = useState(true)

  const formData = useSelector((state) => state.form.formData)

  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const dataToSend = {
      ...formData,
      otp,
    }
    try {
      const data = await registerStore(dataToSend)
      setIsLoading(false)
      if (data.success) {
        toast('success', `Account created successfully`)
        dispatch(setLoginPage(<StoreLogin />))
        navigate('/login')
      } else if (data.type === 'StoreEmailInUse') {
        setError(data.message)
      } else if (data.type === 'InvalidOTP') {
        toast('error', `Invalid or expired OTP`)
        setError(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const resendOTP = async () => {
    setIsResendDisabled(true)
    setTimer(60)
    const data = await sendStoreOTP(formData)
    if (data.success) {
      alert('New OTP is send to your email')
    }
  }

  useEffect(() => {
    let interval = null
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1)
      }, 1000)
    } else {
      setIsResendDisabled(false)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isResendDisabled, timer])

  useEffect(() => {
    if (!formData?.email) {
      setPage(<StoreRegister />)
      alert('email is required')
      navigate('/register')
    }
  }, [])

  return (
    <main className=" flex flex-col min-h-screen h-auto items-center justify-center mx-auto py-10 pb-20">
      <SEO
        title={'OTP Verification '}
        description={'Store OTP verification page'}
      />
      <div className="w-[95%] mx-4 sm:w-2/4 md:w-1/4  flex flex-col items-center min-w-96  rounded-xl  overflow-hidden shadow-md border border-gray-500/5  bg-secondary px-3 py-3 pb-6">
        <h1 className="text-2xl lg:text-3xl text-center my-5 font-bold text-sAccent">
          Store OTP Verification
        </h1>
        <p className="mr-auto mb-2">Enter the OTP send to {formData?.email}</p>
        <form
          className="w-full flex flex-col items-center "
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="focus:outline-sAccent"
          />
          {error && (
            <span className="text-red-500 text-sm mr-auto ">
              OTP is either expired or not valid
            </span>
          )}
          <button
            type="submit"
            className="h-12 transition-all border w-full mx-2 my-4 rounded-xl hover:bg-sAccent border-sAccent font-bold text-sAccent hover:text-white "
          >
            {isLoading ? 'Loading...' : 'Confirm'}
          </button>
        </form>
        {isResendDisabled && <span>{`resend otp in ${timer} seconds`}</span>}
        <div className="flex justify-end w-full my-3 ">
          <button
            className={` text-blue-500 ${
              isResendDisabled
                ? 'cursor-not-allowed text-gray-500'
                : 'hover:text-uAccent'
            }`}
            onClick={resendOTP}
            disabled={isResendDisabled}
          >
            resend OTP
          </button>
        </div>
        <p className="text-red-600 py-3 text-base">
          OTP is valid for only 5 minutes. Don't reload the page!
        </p>
      </div>
    </main>
  )
}
export default StoreOTP
