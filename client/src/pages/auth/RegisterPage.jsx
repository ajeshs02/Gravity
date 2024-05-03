import UserRegister from './userAuth/UserRegister'
import { useEffect, useState } from 'react'
import StoreRegister from './storeAuth/StoreRegister'
import { FaStore, FaUserAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { setPage } from '../../state/slices/formSlice'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const page = useSelector((state) => state.form.page)

  const handleButtonClick = (page) => {
    dispatch(setPage(page))
  }

  return (
    <main className=" flex flex-col min-h-screen h-auto items-center justify-center mx-auto py-10 pb-20">
      <div className="w-[95%] mx-4 sm:w-2/4 md:w-1/4  flex flex-col items-center min-w-96  rounded-3xl  overflow-hidden shadow-md border border-gray-500/5  bg-secondary">
        <div className="w-full  flex justify-center h-20  ">
          <button
            className={`w-full border font-bold text-uAccent border-uAccent/50 rounded-tl-3xl gap-1 flex flex-col flex-center ${
              page === 'UserRegister' && 'bg-uAccent text-white'
            }`}
            onClick={() => handleButtonClick('UserRegister')}
          >
            <FaUserAlt />
            I'm here to buy
          </button>
          <button
            className={`w-full border font-bold text-sAccent border-sAccent/50 gap-1 rounded-tr-3xl flex flex-col flex-center ${
              page === 'StoreRegister' && 'bg-sAccent text-white'
            }`}
            onClick={() => handleButtonClick('StoreRegister')}
          >
            <FaStore />
            I'm here to sell
          </button>
        </div>
        {page === 'UserRegister' ? <UserRegister /> : <StoreRegister />}
      </div>
    </main>
  )
}
export default RegisterPage
