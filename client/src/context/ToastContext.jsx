import React, { createContext, useContext } from 'react'
import { toast } from 'react-toastify'

const ToastContext = createContext()

export const useToast = () => {
  return useContext(ToastContext)
}

export const ToastProvider = ({ children }) => {
  const showToast = (type, message) => {
    switch (type) {
      case 'success':
        toast.success(message, {
          position: 'bottom-left',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
        break
      case 'error':
        toast.error(message, {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
        break
      case 'info':
        toast.info(message, {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
        break
      default:
        break
    }
  }

  return (
    <ToastContext.Provider value={showToast}>{children}</ToastContext.Provider>
  )
}
