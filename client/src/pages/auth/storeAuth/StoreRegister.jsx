import { useForm } from 'react-hook-form'
import FormField from '../../../components/form/FormField'
import FormTextArea from '../../../components/form/FormTextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegistrationSchema } from '../../../schema/zodSchema'
import { Link, useNavigate } from 'react-router-dom'
import { sendStoreOTP } from '../../../api/auth'
import { useDispatch } from 'react-redux'
import { setFormData, setLoginPage } from '../../../state/slices/formSlice'
import { useToast } from '../../../context/ToastContext'
import SEO from '../../../Seo'

const StoreRegister = () => {
  const dispatch = useDispatch()

  const toast = useToast()

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(RegistrationSchema) })

  const onsubmit = async (formData) => {
    try {
      const data = await sendStoreOTP(formData)
      // console.log('data recieved', data)
      if (data.success) {
        toast('info', `An OTP has been sent to ${formData.email}`)
        dispatch(setFormData(formData))
        navigate('/store/verify-otp')
      } else if (data.type === 'EmailInUse') {
        toast('error', 'Email already in use')
        setError('email', {
          type: 'manual',
          message: data.message,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = () => {
    dispatch(setLoginPage('StoreLogin'))
    navigate('/login')
  }

  return (
    <section className="px-4 w-full   flex justify-center items-center">
      <SEO
        title={'Store Register'}
        description={'Store account registration page'}
      />
      <div className="w-full  flex flex-col items-center ">
        <h1 className="text-2xl lg:text-3xl text-center my-5 font-bold text-sAccent">
          Create Store
        </h1>
        <form
          className="w-full flex flex-col items-center "
          onSubmit={handleSubmit(onsubmit)}
        >
          {/* Store Name */}
          <FormField
            user="store"
            type="text"
            placeholder="Enter your store name"
            name="name"
            id="name"
            label="Store Name"
            register={register}
            error={errors.name}
          />
          {/* email */}
          <FormField
            user="store"
            type="email"
            placeholder="Enter your store email address"
            name="email"
            id="email"
            label="Email"
            register={register}
            error={errors.email}
          />
          {/* store description */}
          <FormTextArea
            user="store"
            placeholder="Enter store description. Maximum 300 characters"
            name="description"
            id="description"
            label="Store Description"
            register={register}
            error={errors.description}
            row={4}
          />
          {/* mobile */}
          <FormField
            user="store"
            type="text"
            placeholder="Enter your mobile number"
            name="mobile"
            id="mobile"
            label="Mobile number"
            register={register}
            error={errors.mobile}
          />
          {/* Password */}
          <FormField
            user="store"
            type="password"
            placeholder="Enter Password"
            name="password"
            id="password"
            label="Store Password"
            register={register}
            error={errors.password}
          />
          {/* Confirm Password */}
          <FormField
            user="store"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            label="Confirm Store Password"
            register={register}
            error={errors.confirmPassword}
          />

          <button
            disabled={isSubmitting || isLoading}
            type="submit"
            className={`h-12 transition-all border w-full mx-2 my-4 rounded-xl  border-sAccent font-bold text-sAccent hover:text-white ${
              isSubmitting
                ? 'bg-gray-500 hover:bg-gray-500'
                : 'hover:bg-sAccent'
            } `}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <span className="mb-5">
          Already have an account ? &nbsp;
          <button
            onClick={handleLogin}
            className="text-sAccent hover:underline"
          >
            Login
          </button>
        </span>
      </div>
    </section>
  )
}
StoreRegister.displayName = 'StoreRegister'
export default StoreRegister
