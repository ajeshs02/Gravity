import { useForm } from 'react-hook-form'
import FormField from '../../../components/form/FormField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { LoginSchema } from '../../../schema/zodSchema'
import { adminLogin } from '../../../api/admin'
import { login } from '../../../state/slices/adminSlice'
import { useDispatch } from 'react-redux'
import { useToast } from '../../../context/ToastContext'

const AdminLoginComponent = () => {
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
      const data = await adminLogin(formData)

      if (data.success) {
        toast('success', 'Login successful')
        dispatch(login())
        navigate('/admin')
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
      } else if (data.error.type === 'UnauthorizedAccess') {
        toast('error', 'You are not authorized to access this')
        setError('password', {
          type: 'manual',
          message: data.error.message,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="px-4 w-full   flex justify-center items-center">
      <div className="w-full  flex flex-col items-center ">
        <h1 className="text-2xl lg:text-3xl text-center my-5 font-bold text-uAccent">
          Admin Login
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
      </div>
    </section>
  )
}

export default AdminLoginComponent
