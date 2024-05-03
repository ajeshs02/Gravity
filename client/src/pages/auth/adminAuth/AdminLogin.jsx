import SEO from '../../../Seo'
import AdminLoginComponent from './Login'

const AdminLoginPage = () => {
  return (
    <main className=" flex flex-col min-h-[70vh] h-auto items-center justify-center mx-auto">
      <SEO title={'Gravshop Admin Login'} description={'Admin Login Page'} />
      <div className="w-[95%] mx-4 sm:w-2/4 md:w-1/4  flex flex-col items-center min-w-96  rounded-3xl  overflow-hidden border border-gray-400/45 shadow-lg bg-secondary">
        <AdminLoginComponent />
      </div>
    </main>
  )
}
export default AdminLoginPage
