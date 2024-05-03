import { Link } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'

const StoreProductCard = ({ product }) => {
  const {
    _id,
    name,
    images = [],
    price,
    avgRating,
    stock,
    numOfReviews,
    discount,
    softDelete,
  } = product
  return (
    <article
      className={`group relative   h-[380px] max-h-fit  max-sm:h-[150px]  `}
    >
      <Link
        to={`/store/product/${_id}`}
        className="h-full w-full   overflow-hidden flex flex-col max-sm:flex-row  bg-secondary/50 rounded-md  transition-all z-0 shadow-sm hover:scale-[1.01] hover:shadow-md"
      >
        <div className="h-4/6 max-sm:h-full w-full max-sm:w-3/5 bg-secondary p-2 relative">
          {discount > 0 && (
            <div className="absolute -left-1 -top-1 w-10 h-10 rounded-full flex flex-center font-bold text-white whitespace-nowrap bg-sAccent -rotate-12">
              -{Number(discount)} %
            </div>
          )}
          <img
            src={images[0].url}
            alt={name}
            className="h-full w-full object-contain object-center"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-y-1 items-start max-sm:justify-start h-1/4 max-sm:h-full w-full p-2">
          <h2
            className={`"text-lg  font-semibold ${
              softDelete && 'text-red-600'
            } `}
          >
            {name}
          </h2>
          {discount > 0 ? (
            <div className="flex gap-x-1 items-center">
              <h3 className=" font-semibold">
                &#8377; {Number(price - (price * discount) / 100).toFixed(2)}
              </h3>
              <h3 className="text-sm text-gray-700 line-through">
                &#8377; {Number(price)}
              </h3>
            </div>
          ) : (
            <h3>&#8377; {Number(price)}</h3>
          )}
          <div className="flex items-center gap-x-1">
            <Rating
              readonly={true}
              iconsCount={5}
              initialValue={avgRating}
              SVGclassName={'inline-block'}
              size={24}
            />
            <p className="text-gray-700 text-sm mt-1">({numOfReviews})</p>
          </div>
        </div>
      </Link>
    </article>
  )
}
export default StoreProductCard
