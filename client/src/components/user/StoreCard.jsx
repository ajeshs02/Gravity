import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { motion } from 'framer-motion'

const StoreCard = ({ item }) => {
  const { _id, storeName, image, totalFollowers } = item
  const transition = { type: 'spring', duration: 0.3 }

  return (
    <motion.article
      initial={{ scale: 0.8, opacity: 0.8 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ ...transition, type: 'tween' }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.05 },
      }}
      whileTap={{ scale: 0.95 }}
      className="group  h-[300px] max-h-fit  max-sm:h-[150px] "
    >
      <Link
        to={`/store/${_id}`}
        className="h-full w-full   overflow-hidden flex flex-col max-sm:flex-row  bg-secondary/50 rounded-md  transition-all z-0 shadow-sm hover:scale-[1.01] hover:shadow-md"
      >
        <div className="h-4/6 max-sm:h-full w-full max-sm:w-3/5 bg-secondary p-2 relative">
          <img
            loading="eager"
            src={image.url}
            alt={storeName}
            className="h-full w-full object-contain object-center"
          />
        </div>
        <div className="flex flex-col gap-y-1 items-start max-sm:justify-start h-1/4 max-sm:h-full w-full p-2">
          <h2 className="text-lg  font-semibold">{storeName}</h2>
          <div className="flex items-center gap-x-1">
            <p className="text-gray-700">{totalFollowers}</p>
            Followers
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
export default StoreCard
