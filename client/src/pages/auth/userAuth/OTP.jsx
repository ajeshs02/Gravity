import { useState, useEffect } from 'react'
import { registerUser, sendUserOTP } from '../../../api/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SEO from '../../../Seo'
import { useToast } from '../../../context/ToastContext'

const OTP = () => {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(60)
  const [isResendDisabled, setIsResendDisabled] = useState(true)

  const formData = useSelector((state) => state.form.formData)

  const navigate = useNavigate()
  const toast = useToast()

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const dataToSend = {
      ...formData,
      otp,
    }
    try {
      const data = await registerUser(dataToSend)
      setIsLoading(false)
      if (data.success) {
        toast('success', `Account created successfully`)
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
    setIsLoading(true)
    try {
      const data = await sendUserOTP(formData)
      if (data.success) {
        alert('New OTP is send to your email')
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      if (error.type === 'EmailInUse') {
        setError(error.message)
      } else {
        console.error(error)
      }
    }
  }

  return (
    <main className=" flex flex-col min-h-screen h-auto items-center justify-center mx-auto py-10 pb-20">
      <SEO
        title={'OTP Verification '}
        description={'User OTP verification page'}
      />
      <div className="w-[95%] mx-4 sm:w-2/4 md:w-1/4  flex flex-col items-center min-w-96  rounded-xl  overflow-hidden shadow-md border border-gray-500/5  bg-secondary px-3 py-3 pb-6">
        <h1 className="text-2xl lg:text-3xl text-center my-5 font-bold text-uAccent">
          OTP Verification
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
            className="focus:outline-uAccent"
          />
          {error && (
            <span className="text-red-500 text-sm mr-auto ">
              OTP is either expired or not valid
            </span>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 transition-all border w-full mx-2 my-4 rounded-xl hover:bg-uAccent border-uAccent font-bold text-uAccent hover:text-white "
          >
            {isLoading ? 'Submitting...' : 'Confirm'}
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
        <p className="text-red-500 py-3 text-base text-center">
          OTP is valid for only 5 minutes.
          <br />
          Don't reload the page!
        </p>
      </div>
    </main>
  )
}
export default OTP
