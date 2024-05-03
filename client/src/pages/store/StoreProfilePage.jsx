import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MdEmail } from 'react-icons/md'
import ProductsGrid from '../../components/common/ProductGrid'
import { FaEdit, FaPhoneAlt } from 'react-icons/fa'
import {
  getStoreProducts,
  getStoreProfile,
  storeProfileImageChange,
} from '../../api/store'
import { CircularProgress } from '@mui/material'
import EditStoreProfileModal from '../../components/store/EditStoreProfileModal'
import SEO from '../../Seo'
import { useToast } from '../../context/ToastContext'

const StoreProfile = () => {
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)
  const { storeId } = useParams()

  const toast = useToast()

  const queryClient = useQueryClient()

  const {
    data: store,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['store_profile', storeId],
    queryFn: () => getStoreProfile(),
  })

  // useEffect(() => {
  //   console.log(store)
  // }, [isLoading])

  const { mutateAsync: updateStoreProfile, isPending } = useMutation({
    mutationFn: (data) => storeProfileImageChange(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['store_profile'], { exact: true })
      toast('success', 'profile picture updated successfully')
    },
  })

  const handleImageChange = async (event) => {
    if (event.target.files.length > 0) {
      const selectedImage = event.target.files[0]

      const formData = new FormData()
      formData.append('image', selectedImage)

      await updateStoreProfile(formData)
    }
  }

  return isLoading ? (
    <section className="w-full h-72 flex justify-center items-center gap-y-4 font-medium ">
      <SEO
        title={`Store Profile Page`}
        description={'This is store profile page'}
      />
      <CircularProgress style={{ scale: '1.5' }} />
    </section>
  ) : (
    <>
      <SEO
        title={`${store.storeName} - profile page`}
        description={store.description}
      />
      {modal && <EditStoreProfileModal setModal={setModal} />}
      <section className="mb-12   mx-auto bg-secondary p-3 rounded-md">
        <div className="flex max-sm:flex-col justify-center mx-auto gap-x-3 lg:gap-x-9 lg:max-w-[70%]">
          <div className="w-32 h-32 ml-auto max-md:mx-auto  lg:w-44 lg:h-44 flex justify-end items-start  relative bg-primary aspect-square rounded-full ">
            <figure className=" ml-auto w-full h-full flex justify-end items-start  relative bg-primary aspect-square rounded-full overflow-hidden flex-center">
              {isPending ? (
                <CircularProgress />
              ) : (
                <img
                  src={store?.image?.url}
                  alt={store.name}
                  loading="lazy"
                  className="w-full h-full object-cover  object-center  "
                />
              )}
            </figure>

            {/* upload image */}
            <label
              className={`absolute right-0 bottom-0 h-8 w-8 aspect-square flex flex-col  items-center justify-center border bg-sAccent border-white rounded-full  text-2xl text-white mb-2 hover:cursor-pointer`}
            >
              <input
                type="file"
                className="hidden"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              <FaEdit className="scale-90" />
            </label>
          </div>

          <div className="w-full md:w-3/5 max-md:mx-auto  max-md:mt-7 flex flex-col pl-3 ">
            <div className="flex justify-start gap-x-5">
              <h2 className="text-xl lg:text-3xl font-semibold ">
                {store.storeName}
              </h2>
              <button
                aria-label="edit"
                onClick={() => setModal(true)}
                className="p-1 px-2 flex flex-center text-xl  text-sAccent font-semibold rounded-lg active:scale-[0.99] ml-auto"
              >
                <FaEdit />
              </button>
            </div>
            <div className="bg-blue-100 flex flex-col p-1 py-3 my-3 items-start rounded-lg">
              <h2 className=" font-semibold mb-1">Store Description</h2>
              <p className={`text-base leading-snug  whitespace-pre-wrap `}>
                {store.description}
              </p>
            </div>
            <p className="flex items-center max-sm:text-sm mb-2 gap-x-1">
              <span>
                <MdEmail />{' '}
              </span>
              <a href={`mailto:${store.email}`}>{store.email}</a>
            </p>
            <p className="flex items-center max-sm:text-sm gap-x-1">
              <span>
                <FaPhoneAlt />{' '}
              </span>
              <a href={`tel:${store.mobile}`}>{store.mobile}</a>
            </p>

            <div className="flex flex-center gap-x-2 my-2 w-fit text-black text-lg mt-10">
              <p className="space-x-2 text-gray-700">
                <span className="font-bold text-black">
                  {store.totalFollowers === 0
                    ? 'No followers yet'
                    : store.totalFollowers === 1
                    ? '1 follower'
                    : `${store.totalFollowers} followers`}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <ProductsGrid
        fn={() => getStoreProducts('all')}
        page={page}
        setPage={setPage}
        link={'/store/product'}
        user="store"
      />
    </>
  )
}
export default StoreProfile
