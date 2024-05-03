import { motion } from 'framer-motion'
import Skeleton from '@mui/material/Skeleton'

const CardSkelton = () => {
  const transition = { type: 'spring', duration: 0.3 }

  return (
    <motion.article
      initial={{ scale: 0.8, opacity: 0.8 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ ...transition, type: 'tween' }}
      whileHover={{
        scale: 1.02,
        shadow: 'black',
        transition: { duration: 0.1 },
      }}
      whileTap={{ scale: 0.95 }}
      className="  h-[300px] max-h-fit rounded-md  max-sm:h-[150px]"
    >
      <div className="h-full w-full  overflow-hidden flex flex-col max-sm:flex-row  bg-secondary/50 rounded-md  transition-all z-0 shadow-sm hover:scale-[1.01] hover:shadow-md ">
        <div className="relative mx-3 mt-3 flex w-64 sm:w-auto h-full max-h-full pb-5  overflow-hidden rounded-xl  ">
          <Skeleton
            sx={{ height: '100%', width: '100%', borderRadius: '12px' }}
            animation="wave"
            variant="rectangular"
          />
        </div>

        {/* Bottom  */}
        <div className="flex flex-col px-3 w-full  my-4 sm:my-auto ">
          <Skeleton animation="wave" />
          <div className="flex flex-col sm:flex-row gap-x-3">
            <Skeleton animation="wave" width="70%" />
          </div>
          <Skeleton animation="wave" width="60%" />
        </div>
      </div>
    </motion.article>
  )
}
export default CardSkelton
