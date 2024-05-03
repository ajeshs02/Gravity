import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userLogoutApi, storeLogoutApi } from '../../api/auth'
import { userLogout } from '../../state/slices/userSlice'
import { storeLogout } from '../../state/slices/storeSlice'

const UserLogoutModal = ({ setLogoutModal }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loginPage = useSelector((state) => state.form.loginPage)

  const logoutHandler = async () => {
    try {
      if (loginPage === 'UserLogin') {
        await userLogoutApi()
        setLogoutModal(false)
        dispatch(userLogout())
        navigate('/login')
      } else {
        await storeLogoutApi()
        setLogoutModal(false)
        dispatch(storeLogout())
        navigate('/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Logout failed')
    }
  }

  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70">
      <div className="w-2/5 max-sm:w-4/5 h-44 r p-5 flex flex-col bg-slate-50 rounded-md">
        <div className="h-3/4 text-start flex justify-start items-center">
          <p className="text-lg flex font-medium">
            Are you sure you want to logout?
          </p>
        </div>
        <div className="h-1/4 flex gap-x-2 w-full ">
          <button
            className={`border border-red-600 w-2/4 bg-red-100 flex items-center justify-center py-3 rounded hover:bg-red-600 hover:text-white font-semibold active:scale-95 hover:shadow transition-all `}
            onClick={() => logoutHandler()}
          >
            logout
          </button>
          <button
            className="border active:scale-95 border-blue-600 bg-blue-100 flex items-center justify-center w-2/4 py-3 rounded hover:bg-blue-600 hover:text-white font-semibold hover:shadow transition-all "
            onClick={() => {
              setLogoutModal(false)
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  )
}
export default UserLogoutModal
