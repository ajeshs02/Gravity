import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { checkUserTokenExpiration } from '../../state/slices/userSlice'
import { checkStoreTokenExpiration } from '../../state/slices/storeSlice'
import { checkAdminTokenExpiration } from '../../state/slices/adminSlice'

const ProtectedRoute = ({ children, role }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkUserTokenExpiration())
    dispatch(checkStoreTokenExpiration())
    dispatch(checkAdminTokenExpiration())
  }, [dispatch])

  const isUserAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const isStoreAuthenticated = useSelector(
    (state) => state.store.isAuthenticated
  )
  const isAdminAuthenticated = useSelector(
    (state) => state.admin.isAuthenticated
  )

  if (role === 'admin' && !isAdminAuthenticated) {
    return <Navigate to={'/admin-login'} replace={false} />
  }

  if (role === 'user' && !isUserAuthenticated) {
    return <Navigate to={'/login'} replace={false} />
  }

  if (role === 'store' && !isStoreAuthenticated) {
    return <Navigate to={'/login'} replace={false} />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute
