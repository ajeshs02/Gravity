import { useEffect, useState } from 'react'
import _ from 'lodash'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addAddress, fetchAddress, updateAddress } from '../../api/user'

const AddressModal = ({ makePayment, setAddressModal, isPaymentLoading }) => {
  const [addressDetails, setAddressDetails] = useState({
    address: '',
    street: '',
    city: '',
    state: '',
    pin: '',
  })
  const [initialAddress, setInitialAddress] = useState({
    address: '',
    street: '',
    city: '',
    state: '',
    pin: '',
  })
  const [isAddressFetched, setIsAddressFetched] = useState(false)
  const [isAddressChanged, setIsAddressChanged] = useState(false)
  const [isAnyValueEmpty, setIsAnyValueEmpty] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setAddressDetails({
      ...addressDetails,
      [name]: value,
    })
  }

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['address'],
    queryFn: fetchAddress,
  })

  useEffect(() => {
    if (!isLoading) {
      if (data.address.addressDetails) {
        setIsAddressFetched(true)
        const { address, street, city, state, pin } =
          data.address.addressDetails
        setAddressDetails({
          address: address,
          street: street,
          city: city,
          state: state,
          pin: pin,
        })
        setInitialAddress({
          address: address,
          street: street,
          city: city,
          state: state,
          pin: pin,
        })
      } else {
        setIsAddressFetched(false)
      }
    }
  }, [isLoading])

  const { mutateAsync: addAddressMutation, isPending: isAdding } = useMutation({
    mutationFn: addAddress,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['address'], { exact: true })
      // console.log('addAddressMutation', data)
      if (data.address.addressDetails) {
        setIsAddressFetched(true)
        const { address, street, city, state, pin } =
          data.address.addressDetails
        setAddressDetails({
          address: address,
          street: street,
          city: city,
          state: state,
          pin: pin,
        })
        setInitialAddress({
          address: address,
          street: street,
          city: city,
          state: state,
          pin: pin,
        })
      } else {
        setIsAddressFetched(false)
      }
    },
  })

  const { mutateAsync: updateAddressMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: updateAddress,
      onSuccess: (data) => {
        queryClient.invalidateQueries(['address'], { exact: true })
        if (data.updatedAddress.addressDetails) {
          const { address, street, city, state, pin } =
            data.updatedAddress.addressDetails
          setAddressDetails({
            address: address,
            street: street,
            city: city,
            state: state,
            pin: pin,
          })
          setInitialAddress({
            address: address,
            street: street,
            city: city,
            state: state,
            pin: pin,
          })
        }
      },
    })

  const addAddressHandler = async (e) => {
    e.preventDefault()
    try {
      await addAddressMutation(addressDetails)
    } catch (error) {
      console.error(error)
    } finally {
      setAddressModal(false)
    }
  }

  const updateAddressHandler = async (e) => {
    e.preventDefault()
    try {
      await updateAddressMutation(addressDetails)
    } catch (error) {
      console.error(error)
    } finally {
      setAddressModal(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    makePayment()
  }

  useEffect(() => {
    let valueEmpty = Object.values(addressDetails).some((value) => value === '')
    setIsAnyValueEmpty(valueEmpty)
  }, [addressDetails])

  useEffect(() => {
    const isEqual = _.isEqual(initialAddress, addressDetails)
    setIsAddressChanged(!isEqual)
  }, [initialAddress, addressDetails])

  return (
    <div
      className={`fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70 ${
        isPaymentLoading && 'cursor-wait'
      }`}
    >
      <div className="absolute top-5"></div>
      <div className="w-11/12 sm:w-8/12 md:w-7/12 lg:w-5/12 h-[80vh]  r p-5 flex flex-col bg-slate-50 rounded-md">
        <div className="flex relative flex-col w-full h-full p-2 items-center justify-start">
          <img
            src="../../../assets/icons/modal-close.png"
            className="absolute p-1 scale-75 hover:shadow-xl cursor-pointer rounded-full right-1 top-1 bg-uAccent"
            alt="close modal"
            onClick={() => setAddressModal(false)}
          />
          <h1 className="text-center text-xl lg:text-2xl font-semibold mb-5">
            Shipping Address
          </h1>
          <form
            onSubmit={
              isAddressFetched
                ? isAddressChanged
                  ? updateAddressHandler
                  : handleSubmit
                : addAddressHandler
            }
            className="w-full h-full overflow-hidden px-1"
          >
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={addressDetails?.address}
                onChange={handleChange}
                pattern="^[A-Za-z0-9\s,.]{5,}$"
                title="Address must be at least 5 characters long and contain only alphanumeric characters"
                required
              />
            </label>
            <label>
              Street:
              <input
                type="text"
                name="street"
                value={addressDetails.street}
                onChange={handleChange}
                pattern="^[A-Za-z0-9\s]{3,}$"
                title="Street must be at least 3 characters long and contain only alphanumeric characters"
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={addressDetails.city}
                onChange={handleChange}
                pattern="^[A-Za-z\s]{3,}$"
                title="City must be at least 3 characters long and contain only alphabets"
                required
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={addressDetails.state}
                onChange={handleChange}
                pattern="^[A-Za-z\s]{3,}$"
                title="State must be at least 3 characters long and contain only alphabets"
                required
              />
            </label>
            <label>
              PIN Code:
              <input
                type="text"
                name="pin"
                value={addressDetails.pin}
                onChange={handleChange}
                pattern="^[0-9]{6}$"
                title="PIN Code must be 6 digits"
                required
              />
            </label>
            {/* submit button */}
            <button
              className={`w-full   ${
                isAnyValueEmpty
                  ? 'bg-gray-700 opacity-50 text-gray-600 cursor-not-allowed'
                  : 'bg-uAccent'
              } ${
                (isLoading || isAdding || isUpdating) &&
                'cursor-wait bg-gray-700 opacity-50 text-gray-600'
              }  mt-7 self-end  h-10  flex justify-center  items-center text-lg shadow-md  rounded-3xl text-white transition-all active:scale-95    `}
              type="submit"
              disabled={isLoading || isAdding || isUpdating || isAnyValueEmpty}
            >
              {isLoading || isAdding || isUpdating || isPaymentLoading
                ? 'Loading...'
                : isAddressFetched
                ? isAddressChanged
                  ? 'Update Address'
                  : 'Buy Now'
                : 'Add Address'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default AddressModal
