import { MdEmail } from 'react-icons/md'
import SEO from '../../Seo'
import { CircularProgress } from '@mui/material'
import { FaPhoneAlt } from 'react-icons/fa'

const StoreChatProfile = ({ store, isProfileLoading }) => {
  return isProfileLoading ? (
    <>
      <SEO title={`Profile Page`} description={'This is user Profile page'} />
      <div className="w-full h-72 flex justify-center items-center gap-y-4 font-medium ">
        <CircularProgress style={{ scale: '1.5' }} />
      </div>
    </>
  ) : (
    <div className="flex flex-col bg-secondary p-3 rounded-xl shadow-lg h-56 justify-around mt-16 items-center mx-auto gap-x-3 ">
      <SEO
        title={`${store.storeName} - profile Page`}
        description={'This is store chat page'}
      />
      {/* image */}
      <div className="  flex  flex-col flex-center relative  ">
        <figure className="bg-primary w-32 h-32 aspect-square !rounded-full  overflow-hidden ">
          <img
            src={store.image?.url}
            alt={store.storeName}
            loading="lazy"
            className="w-full h-full object-cover  object-center  "
          />
        </figure>
        <h1 className="text-center">{store.storeName}</h1>
      </div>
      {/*right*/}
      <div className="w-full flex flex-col gap-y-2 pl-3 ">
        <p className="flex flex-center text-sm mb-2 gap-x-1">
          <span>
            <FaPhoneAlt />{' '}
          </span>
          <a href={`tel:${store.mobile}`}>{store.mobile}</a>
        </p>
        <p className="flex flex-center text-xs mb-2 gap-x-1">
          <span>
            <MdEmail />{' '}
          </span>
          <a href={`mailto:${store.email}`}>{store.email}</a>
        </p>
      </div>
    </div>
  )
}
export default StoreChatProfile
