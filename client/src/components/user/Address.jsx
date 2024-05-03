import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchAddress } from '../../api/user'
import { CircularProgress } from '@mui/material'
import EditAddressModal from './EditAddressModal'

const Address = () => {
  const [addressModal, setAddressModal] = useState(false)
  const {
    data: {
      address: {
        addressDetails: { address, state, pin, street, city } = {},
      } = {},
    } = {},
    isLoading: isAddressLoading,
  } = useQuery({
    queryKey: ['address'],
    queryFn: fetchAddress,
  })

  return (
    <div
      aria-label="address"
      className="w-full sm:w-3/5 md:w-6/12 lg:w-4/12 mx-auto  h-fit r p-5 flex flex-col bg-primary rounded-md"
    >
      <div className="flex relative flex-col w-full h-full p-2 px3 items-center justify-start">
        {addressModal && <EditAddressModal setAddressModal={setAddressModal} />}
        <div className="absolute -right-1 -to *:flex *:flex-center  ">
          <button
            className="px-2 text-lg bg-uAccent text-white rounded-md active:scale-[0.99]"
            onClick={() => setAddressModal(true)}
          >
            edit
          </button>
        </div>
        <h1 className="text-center text-xl lg:text-2xl mt-4 font-semibold mb-5">
          Shipping Address
        </h1>
        {isAddressLoading ? (
          <CircularProgress />
        ) : (
          <div className="w-full h-full overflow-hidden px-1 ">
            {/* Address */}
            <div className="flex flex-col items-start rounded-lg  justify-between mb-2">
              <label className="">Address</label>
              <p className="font-semibold rounded-lg  w-full bg-secondary h-auto  p-2 ">
                {address}
              </p>
            </div>

            {/* Street */}
            <div className="flex flex-col items-start rounded-lg  justify-between mb-2">
              <label className="">Street</label>
              <p className="font-semibold rounded-lg  w-full bg-secondary h-auto  p-2 ">
                {street}
              </p>
            </div>
            {/* City */}
            <div className="flex flex-col items-start rounded-lg  justify-between mb-2">
              <label className="">City</label>
              <p className="font-semibold rounded-lg  w-full bg-secondary h-auto  p-2 ">
                {city}
              </p>
            </div>

            {/* State */}
            <div className="flex flex-col items-start rounded-lg  justify-between mb-2">
              <label className="">State</label>
              <p className="font-semibold rounded-lg  w-full bg-secondary h-auto  p-2 ">
                {state}
              </p>
            </div>

            {/* Pin */}
            <div className="flex flex-col items-start rounded-lg  justify-between mb-2">
              <label className="">PIN</label>
              <p className="font-semibold rounded-lg  w-full bg-secondary h-auto  p-2 ">
                {pin}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Address
