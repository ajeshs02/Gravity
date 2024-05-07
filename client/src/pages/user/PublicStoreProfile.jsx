import { useNavigate, useParams } from 'react-router-dom'
import {
  getStoreProfile,
  getStoreProducts,
  userFOllowStore,
  userMessageStore,
} from '../../api/user'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MdEmail } from 'react-icons/md'
import ProductsGrid from '../../components/common/ProductGrid'
import { FaPhoneAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material'
import SEO from '../../Seo'

const PublicStoreProfile = () => {
  const [isFollowing, setIsFollowing] = useState(false)
  const { storeId } = useParams()

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const currentUserID = useSelector((state) => state.user.id)

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const {
    data: store,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => getStoreProfile(storeId),
  })

  const { mutateAsync: followStoreMutation, isPending } = useMutation({
    mutationFn: userFOllowStore,
    onSuccess: () => {
      queryClient.invalidateQueries(['store', storeId], { exact: true })
    },
  })

  const {
    mutateAsync: messageStoreMutation,
    isPending: isMessageStorePending,
  } = useMutation({
    mutationFn: userMessageStore,
    onSuccess: () => {
      queryClient.invalidateQueries(['chats'], { exact: true })
    },
  })

  const handleFollowButtonClick = async () => {
    setIsFollowing((prevIsFollowing) => !prevIsFollowing)

    try {
      await followStoreMutation(store._id)
    } catch (error) {
      console.error('Error following store:', error)

      setIsFollowing((prevIsFollowing) => !prevIsFollowing)
    }
  }

  const handleInitiateChat = async () => {
    try {
      await messageStoreMutation(store._id)
      navigate('/chats')
    } catch (error) {
      console.error('Error initiating store chat:', error)
    }
  }

  useEffect(() => {
    if (!isLoading && store.followers) {
      const isUserFollowing = store.followers.some(
        (follower) => follower?.user?._id === currentUserID
      )
      setIsFollowing(isUserFollowing)
    }
    // if (!isLoading) console.log(store.followers)
  }, [isLoading])

  return isLoading ? (
    <>
      <SEO
        title={`Store profile Page`}
        description={'This is store profile page'}
      />
      <div className="w-full h-72 flex justify-center items-center gap-y-4 font-medium ">
        <CircularProgress style={{ scale: '1.5' }} />
      </div>
    </>
  ) : (
    <>
      <section className="mb-12   mx-auto bg-secondary p-3 rounded-md">
        <SEO
          title={`${store.storeName} - Profile Page`}
          description={store.description}
        />
        <div className="flex justify-center mx-auto gap-x-3 lg:gap-x-9 lg:max-w-[70%]">
          <div className="w-32 h-32 ml-auto  lg:w-44 lg:h-44 flex justify-end items-start  relative bg-primary aspect-square rounded-full ">
            <figure className=" ml-auto w-full h-full flex justify-end items-start  relative bg-primary aspect-square rounded-full overflow-hidden flex-center">
              <img
                src={store.image.url}
                alt={store.storeName}
                loading="lazy"
                className="w-full h-full object-contain object-center  "
              />
            </figure>
          </div>

          <div className="w-3/5 flex flex-col pl-3 ">
            <div className="flex justify-start gap-x-5">
              <h2 className="text-xl lg:text-3xl font-semibold capitalize">
                {store.storeName}
              </h2>
            </div>
            <div className="flex flex-center gap-x-2 my-2 w-fit text-black text-lg mt-4">
              <p className="space-x-2 text-gray-700 ">
                <span className="font-bold text-black">
                  {store.followers.length}{' '}
                </span>
                followers
              </p>
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
            <div className="flex items-center gap-x-3">
              {isAuthenticated && (
                <button
                  onClick={handleFollowButtonClick}
                  className="p-1 w-24 bg-uAccent text-white font-semibold rounded-lg active:scale-[0.99] my-10 shadow-lg hover:scale-[1.01] "
                  disabled={isPending}
                >
                  {isPending
                    ? 'Loading...'
                    : isFollowing
                    ? 'Following'
                    : 'Follow'}
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={handleInitiateChat}
                  className="p-1 w-24 bg-uAccent text-white font-semibold rounded-lg active:scale-[0.99] my-10 shadow-lg hover:scale-[1.01] "
                  disabled={isPending}
                >
                  {isMessageStorePending ? 'Loading...' : 'Message'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <ProductsGrid fn={() => getStoreProducts({ storeId })} />
    </>
  )
}
export default PublicStoreProfile
