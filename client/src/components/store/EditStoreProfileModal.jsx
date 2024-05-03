import { useEffect, useState } from 'react'
import _ from 'lodash'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getStoreProfile, storeProfileUpdate } from '../../api/store'

const EditStoreProfileModal = ({ setModal }) => {
  const [storeDetails, setStoreDetails] = useState({
    name: '',
    description: '',
    mobile: '',
  })
  const [initialStore, setInitialStore] = useState({
    name: '',
    description: '',
    mobile: '',
  })

  const [isStoreChanged, setIsStoreChanged] = useState(false)
  const [isAnyValueEmpty, setIsAnyValueEmpty] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setStoreDetails({
      ...storeDetails,
      [name]: value,
    })
  }

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['store_profile'],
    queryFn: getStoreProfile,
  })

  useEffect(() => {
    if (!isLoading) {
      const { storeName, description, mobile } = data
      setStoreDetails({
        name: storeName,
        description,
        mobile,
      })
      setInitialStore({
        name: storeName,
        description,
        mobile,
      })
    }
  }, [isLoading])

  const { mutateAsync: updateStoreMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (data) => storeProfileUpdate(data),
      onSuccess: (data) => {
        queryClient.invalidateQueries(['store_profile'], { exact: true })

        const { storeName, description, mobile } = data
        setStoreDetails({
          name: storeName,
          description,
          mobile,
        })
        setInitialStore({
          name: storeName,
          description,
          mobile,
        })
      },
    })

  const updateStoreHandler = async (e) => {
    e.preventDefault()
    try {
      await updateStoreMutation(storeDetails)
      setModal(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    let valueEmpty = Object.values(storeDetails).some((value) => value === '')
    setIsAnyValueEmpty(valueEmpty)
  }, [storeDetails])

  useEffect(() => {
    const isEqual = _.isEqual(initialStore, storeDetails)
    setIsStoreChanged(!isEqual)
  }, [initialStore, storeDetails])

  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70">
      <div className="absolute top-5"></div>
      <div className="w-9/12 sm:w-3/5 md:w-6/12 lg:w-4/12  h-fit r p-5 flex flex-col bg-slate-50 rounded-md">
        <div className="flex relative flex-col w-full h-full p-2 px3 items-center justify-start">
          <img
            src="../../../assets/icons/modal-close.png"
            className="absolute p-1 scale-75 hover:shadow-xl cursor-pointer rounded-full right-1 top-1 bg-sAccent"
            alt="close modal"
            onClick={() => setModal(false)}
          />
          <h1 className="text-center text-xl lg:text-2xl font-semibold mb-5">
            Store Profile
          </h1>
          <form
            onSubmit={isStoreChanged ? updateStoreHandler : null}
            className="w-full h-full overflow-hidden px-1"
          >
            <label>
              Store Name:
              <input
                type="text"
                name="name"
                className="capitalize"
                value={storeDetails.name}
                onChange={handleChange}
                pattern="^[A-Za-z0-9\s]{3,}$"
                title="Street must be at least 3 characters long and contain only alphanumeric characters"
                required
              />
            </label>
            <label>
              Description:
              <textarea
                type="text"
                name="description"
                className=""
                value={storeDetails.description}
                onChange={handleChange}
                pattern="^[A-Za-z0-9\s,.]{5,}$"
                title="Address must be at least 5 characters long and contain only alphanumeric characters"
                required
                rows={3}
              />
            </label>

            <label>
              Mobile
              <input
                type="text"
                name="mobile"
                className="capitalize"
                value={storeDetails.mobile}
                onChange={handleChange}
                pattern="^[6-9]{1}[0-9]{9,11}$"
                title="Mobile number must be 10 to 12 digits long and start with a digit between 6 and 9"
                required
              />
            </label>

            {/* submit button */}
            <button
              className={`w-full    ${
                (isLoading ||
                  isUpdating ||
                  isAnyValueEmpty ||
                  !isStoreChanged) &&
                'cursor-not-allowed bg-gray-700 opacity-50 text-gray-600'
              }  mt-7 self-end  h-10  flex justify-center  items-center text-lg shadow-md  rounded-3xl text-white bg-sAccent transition-all active:scale-95    `}
              type="submit"
              disabled={
                isLoading || isUpdating || isAnyValueEmpty || !isStoreChanged
              }
            >
              {isLoading || isUpdating ? 'Loading...' : 'Update Store'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default EditStoreProfileModal
