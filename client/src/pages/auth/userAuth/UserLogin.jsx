import { useForm } from 'react-hook-form'
import FormField from '../../../components/form/FormField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { userLogin } from '../../../api/auth'
import { LoginSchema } from '../../../schema/zodSchema'
import { useDispatch } from 'react-redux'
import { setPage } from '../../../state/slices/formSlice'
import { login } from '../../../state/slices/userSlice'
import { useToast } from '../../../context/ToastContext'
import SEO from '../../../Seo'

const UserLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(LoginSchema) })

  const onSubmit = async (formData) => {
    try {
      const data = await userLogin(formData)
      if (data.success) {
        toast('success', 'Login successful')
        dispatch(login({ id: data.user.id }))
        navigate('/')
      } else if (data.error.type === 'InvalidCredentials') {
        toast('error', 'Invalid username or password')
        setError('password', {
          type: 'manual',
          message: data.error.message,
        })
        setError('email', {
          type: 'manual',
          message: data.error.message,
        })
      } else if (data.error.type === 'AccountBlocked') {
        toast('error', 'Your account has been temporarily blocked ')
        setError('email', {
          type: 'manual',
          message: data.error.message,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleRegister = () => {
    dispatch(setPage('UserRegister'))
    navigate('/register')
  }

  return (
    <section className="px-4 w-full   flex justify-center items-center">
      <SEO title={'User Login'} description={'User Login Page'} />
      <div className="w-full  flex flex-col items-center ">
        <h1 className="text-2xl lg:text-3xl text-center my-5 font-bold text-uAccent">
          User Login
        </h1>
        <form
          className="w-full flex flex-col items-center "
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* email */}
          <FormField
            type="email"
            placeholder="Enter your email "
            name="email"
            id="email"
            label="Email"
            register={register}
            error={errors.email}
          />

          {/* Password */}
          <FormField
            type="password"
            placeholder="Enter Password"
            name="password"
            id="password"
            label="Password"
            register={register}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 transition-all border w-full mx-2 my-4 rounded-xl hover:bg-uAccent border-uAccent  font-bold text-uAccent hover:text-white "
          >
            {isSubmitting ? 'Loading...' : 'Login'}
          </button>
        </form>
        <span className="mb-5">
          Don't have an account ? &nbsp;
          <button
            onClick={handleRegister}
            className="text-uAccent hover:underline"
          >
            Register
          </button>
        </span>
      </div>
    </section>
  )
}

UserLogin.displayName = 'UserLogin'
export default UserLogin
