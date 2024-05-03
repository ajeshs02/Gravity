import UserLogin from './userAuth/UserLogin'
import { useEffect, useState } from 'react'
import StoreLogin from './storeAuth/StoreLogin'
import { FaStore, FaUserAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { setLoginPage } from '../../state/slices/formSlice'

const LoginPage = () => {
  const loginPage = useSelector((state) => state.form.loginPage)

  const dispatch = useDispatch()

  const handleButtonClick = (page) => {
    dispatch(setLoginPage(page))
  }

  return (
    <main className=" flex flex-col min-h-screen h-auto items-center justify-center mx-auto">
      <div className="w-[95%] mx-4 sm:w-2/4 md:w-1/4  flex flex-col items-center min-w-96  rounded-3xl  overflow-hidden border border-gray-400/45 shadow-lg bg-secondary">
        <div className="w-full  flex justify-center h-20  ">
          <button
            className={`w-full border border-uAccent/50 font-bold text-uAccent rounded-tl-3xl flex  flex-center gap-x-2 ${
              loginPage === 'UserLogin' && 'bg-uAccent text-white'
            }`}
            onClick={() => handleButtonClick('UserLogin')}
          >
            <FaUserAlt className="scale-125" />
            User
          </button>
          <button
            className={`w-full border border-sAccent/50  rounded-tr-3xl font-bold text-sAccent flex flex-center gap-x-2 ${
              loginPage === 'StoreLogin' && 'bg-sAccent text-white'
            }`}
            onClick={() => handleButtonClick('StoreLogin')}
          >
            Store <FaStore className="scale-125" />
          </button>
        </div>
        {loginPage === 'UserLogin' ? <UserLogin /> : <StoreLogin />}
      </div>
    </main>
  )
}
export default LoginPage
