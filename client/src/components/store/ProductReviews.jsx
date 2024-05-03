import { CircularProgress } from '@mui/material'
import Rating from '@mui/material/Rating'

const ProductReviews = ({
  reviews = [],
  isLoading,
  user = 'user',
  productId,
}) => {
  return (
    <div
      id="reviews"
      className={`${
        user === 'store' ? 'bg-red-50' : 'bg-violet-50'
      } w-full sm:w-3/5 mx-4 flex flex-col py-3 my-3 mt-12 items-start rounded-lg p-2 min-h-fit h-auto  `}
    >
      <p className="text-lg font-medium ml-1 mb-3">Reviews</p>
      {isLoading ? (
        <div className="bg-violet-100 py-4 flex justify-center mb-2 rounded-2xl h-28 items-center p-2 w-full">
          <CircularProgress style={{ scale: '0.8' }} />
        </div>
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <article
            key={review._id}
            className={`relative ${
              user === 'store' ? 'bg-red-100' : 'bg-violet-100'
            } py-4 mb-2 rounded-2xl p-2 w-full  transition-all`}
          >
            <div className="flex items-center gap-x-2 h-8 mb-2">
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img
                  src={review.user?.image.url}
                  alt={review.user.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold capitalize">{review.user.name}</h3>
            </div>
            <Rating name="read-only" value={review.rating} readOnly />

            <p>{review.review}</p>
          </article>
        ))
      ) : (
        <p className="text-sm font-semibold text-slate-500">No reviews yet!</p>
      )}
    </div>
  )
}
export default ProductReviews
