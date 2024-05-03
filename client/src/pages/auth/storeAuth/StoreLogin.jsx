import { useForm } from 'react-hook-form'
import FormField from '../../../components/form/FormField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { storeLogin } from '../../../api/auth'
import { LoginSchema } from '../../../schema/zodSchema'
import { useDispatch } from 'react-redux'
import { setPage } from '../../../state/slices/formSlice'
import { login } from '../../../state/slices/storeSlice'
import { useToast } from '../../../context/ToastContext'
import SEO from '../../../Seo'

const StoreLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(LoginSchema) })

  const onSubmit = async (formData) => {
    try {
      const data = await storeLogin(formData)
      if (data.success) {
        toast('success', 'Store Login Success')
        dispatch(login())
        navigate('/store')
      } else if (data.type === 'InvalidCredentials') {
        toast('error', 'Invalid username or password')
        setError('password', {
          type: 'manual',
          message: data.message,
        })
      } else if (data.type === 'AccountBlocked') {
        toast('error', 'Your account has been temporarily blocked ')
        setError('email', {
          type: 'manual',
          message: data.message,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleRegister = () => {
    dispatch(setPage('StoreRegister'))
    navigate('/register')
  }

  return (
    <section className="px-4 w-full   flex justify-center items-center">
      <SEO title={'Store Login'} description={'Store Login Page'} />
      <div className="w-full  flex flex-col items-center ">
        <h1 className="text-2xl lg:text-3xl text-center my-5 font-bold text-sAccent">
          Store Login
        </h1>
        <form
          className="w-full flex flex-col items-center "
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* email */}
          <FormField
            type="email"
            placeholder="Enter store email"
            name="email"
            id="email"
            label="Email"
            register={register}
            error={errors.email}
            user="store"
          />

          {/* Password */}
          <FormField
            type="password"
            placeholder="Enter store password"
            name="password"
            id="password"
            label="Password"
            register={register}
            error={errors.password}
            user="store"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 transition-all border w-full mx-2 my-4 rounded-xl hover:bg-sAccent border-sAccent  font-bold text-sAccent hover:text-white "
          >
            {isSubmitting ? 'Loading...' : 'Login'}
          </button>
        </form>
        <span className="mb-5">
          Don't have an account ? &nbsp;
          <button
            onClick={handleRegister}
            className="text-sAccent hover:underline"
          >
            Register
          </button>
        </span>
      </div>
    </section>
  )
}

StoreLogin.displayName = 'StoreLogin'
export default StoreLogin
