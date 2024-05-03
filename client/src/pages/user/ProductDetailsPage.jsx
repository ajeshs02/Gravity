import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addToCart,
  fetchWishlist,
  getProductById,
  getProductReviews,
  updateWishList,
} from '../../api/user'
import Rating from '@mui/material/Rating'
import ProductDetailsSkelton from '../../components/skelton/ProductDetailsSkelton'
import ReviewModal from '../../components/user/ReviewModal'
import ProductReviews from '../../components/user/ProductReviews'
import { IoMdCart } from 'react-icons/io'
import { MdRateReview } from 'react-icons/md'
import { FaHeart } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useToast } from '../../context/ToastContext'
import SEO from '../../Seo'

const ProductDetailsPage = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [index, setIndex] = useState(0)
  const [reviewModal, setReviewModal] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAlreadyReviewed, setIsAlreadyReviewed] = useState(false)

  const toast = useToast()

  const { id: productId } = useParams()

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const user = useSelector((state) => state.user)

  const { mutateAsync: addToCartMutation, isPending } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
      toast('success', 'Added to cart successfully')
      navigate('/cart')
    },
  })

  const {
    data: {
      _id,
      storeId,
      name,
      category,
      brand,
      description,
      discount,
      price,
      images = [],
      stock,
      numOfReviews,
      avgRating = 0,
    } = {},
    isLoading,
    refetch: productRefetch,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
  })

  const {
    data,
    isLoading: isWishListLoading,
    isFetching,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
  })

  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews', { productId }],
    queryFn: () => getProductReviews(productId),
  })

  const { mutateAsync: addToWishListMutation, isPending: isWishListPending } =
    useMutation({
      mutationFn: updateWishList,
      onSuccess: (data) => {
        queryClient.invalidateQueries(['wishlist', productId], {
          exact: true,
        })
        if (data.isAdded) {
          toast('info', `${name} added to Wishlist`)
        } else {
          toast('info', `${name} removed from Wishlist`)
        }
      },
    })

  useEffect(() => {
    if (!isReviewsLoading) {
      const alreadyReviewed = reviews.some(
        (review) => review.user._id === user.id
      )
      setIsAlreadyReviewed(alreadyReviewed)
    }
  }, [reviews, isReviewsLoading])

  useEffect(() => {
    if (!isWishListLoading && !isWishListPending && !isFetching) {
      const isProductInWishlist = data.wishlist.products.some(
        (product) => product._id === _id
      )
      // console.log(isProductInWishlist)
      setIsWishlisted(isProductInWishlist)
    }
  }, [isWishListLoading, isWishListPending, isFetching, productId])

  const addReview = () => {
    setReviewModal(true)
  }

  const handleWishlistButtonClick = async () => {
    setIsWishlisted((prevIsWishlisted) => !prevIsWishlisted)

    try {
      await addToWishListMutation(_id)
    } catch (error) {
      console.error('Error updating wishlist:', error)

      setIsWishlisted((prevIsWishlisted) => !prevIsWishlisted)
    }
  }

  return (
    <>
      <SEO
        title={'Gravshop - Product Info Page'}
        description={'This is the product details page '}
      />
      {isLoading ? (
        <ProductDetailsSkelton />
      ) : (
        <section className="flex py-2 flex-col mt-14 max-sm:px-2 justify-center overflow-hidden transition-all ease-in-out pb-14">
          <SEO title={name + ' page'} description={description} />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-4 md:gap-x-6 lg:gap-x-10 sm:px-2 md:mx-4  w-full">
            {/* ḷeft */}
            <div className=" flex flex-col max-sm:w-full w-2/4 self-start mx-auto max-h-fit items-center">
              <div className="relative object-cover  flex justify-center aspect-square  w-[350px] sm:w-[330px] rounded-md mb-5 md:w-[380px] lg:w-[530px] overflow-hidden shadow-md shadow-purple-100 p-2 ">
                {discount > 0 && (
                  <div className="absolute -left-1 -top-1 w-10 h-10 rounded-full flex flex-center font-bold text-white whitespace-nowrap bg-sAccent -rotate-12">
                    -{Number(discount)} %
                  </div>
                )}
                <img
                  src={images[index].url}
                  alt={name}
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex mx-auto w-fit justify-center  items-center gap-x-6  px-5">
                {images.length > 0 &&
                  images.map((value, ind) => (
                    <div
                      className={`h-20 w-16 p-1  cursor-pointer hover:shadow-lg lg:h-28 lg:w-20 mx-auto flex justify-center items-center bg-white border-2 border-purple-${
                        index === ind ? '600' : '50'
                      } rounded-xl  `}
                      key={ind}
                      // onMouseOver={() => setIndex(ind)}
                      onClick={() => setIndex(ind)}
                    >
                      <img
                        src={value.url}
                        alt="product sub images"
                        className={`object-contain h-full min-h-fit border-purple-${
                          index === ind ? '500' : '50'
                        }`}
                        loading="lazy"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* right */}
            <div className="flex gap-y-2 max-sm:mx-1 md:px-4 mr-3 flex-col self-start max-sm:w-full w-2/4 max-w-full mx-auto  mt-6  ">
              <p className="text-xs text-sky-600">Brand: {brand}</p>
              <h1 className="text-xl font-medium capitalize">{name}</h1>
              {/* rating */}

              <a
                href="#reviews"
                className="flex gap-x-3 max-md:flex-col whitespace-nowrap text-sky-600"
              >
                <Rating
                  name="half-rating-read"
                  value={avgRating}
                  precision={0.5}
                  readOnly
                />
                {numOfReviews !== 0 ? (
                  <p className="whitespace-nowrap">
                    {numOfReviews} {numOfReviews === 1 ? 'review' : 'reviews'}
                  </p>
                ) : (
                  <p>No ratings yet</p>
                )}
              </a>
              {/* price */}
              {discount && discount > 0 ? (
                <div className="flex flex-col mt-3 gap-y-0 mb-2">
                  <div className="flex">
                    <p className="font-semibold">{'\u20B9 '}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {`${Math.round(
                        (price * (100 - discount)) / 100
                      ).toLocaleString('en-IN')}`}
                    </p>
                  </div>
                  <div className="flex mt-1 text-gray-500 line-through">
                    <p className="font-medium text-xs">{'\u20B9 '}</p>
                    <p className="text-sm sm:text-md  font-medium  h-3 ">{`${price.toLocaleString(
                      'en-IN'
                    )}`}</p>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <p className="mt-2 font-semibold">{'\u20B9 '}</p>
                  <p className="text-3xl my-2 font-bold text-slate-900">{`${price}`}</p>
                </div>
              )}
              <div className="flex items-center  gap-x-3">
                <h2>Stock :</h2>
                <p
                  className={`text-${
                    stock < 10 ? 'red-500' : 'sky-600'
                  } text whitespace-nowrap `}
                >
                  {stock < 10
                    ? stock < 1
                      ? 'Stock Out'
                      : `Hurry, only ${stock} left!`
                    : 'Available'}
                </p>
              </div>

              <div className="text-uAccent hover:underline">
                <Link to={`/store/${storeId}`}>Visit Store</Link>
              </div>
              <div className="flex flex-col mx-auto  whitespace-nowrap my-4 max-w-[400px] w-full text-lg font-semibold  gap-y-4  ">
                <button
                  onClick={handleWishlistButtonClick}
                  className="w-full  py-2 flex  flex-center gap-x-2  text-red-500 border-2 border-red-400 bg-white rounded-xl text-base hover:bg-red-500 hover:text-white shadow-lg active:scale-[0.99] transition-all"
                  disabled={isWishListLoading || isWishListPending}
                >
                  {isWishlisted ? 'Remove from wishlist' : 'Add to Wishlist'}
                  <FaHeart className="scale-100" />
                </button>
                <button
                  onClick={async () => {
                    try {
                      await addToCartMutation({ productId: _id })
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                  disabled={isPending}
                  className="w-full  py-2 flex  flex-center gap-x-2 bg-uAccent text-white rounded-xl hover:scale-[1.005] shadow-lg active:scale-[0.99] transition-all"
                >
                  {isPending ? 'Adding...' : 'Add to cart'}
                  <IoMdCart className="scale-125" />
                </button>
              </div>
              {/* description */}
              <div className="bg-violet-100 flex flex-col p-1 py-3 my-3 items-start rounded-lg">
                <h2 className="text-lg font-medium ml-1">Description</h2>
                <p
                  className={`text-base leading-snug  whitespace-pre-wrap px-1 ${
                    isExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {description}
                </p>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-500 self-end mr-2 mt-2"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>
              {/* buttons */}
            </div>
          </div>
          {reviewModal && (
            <ReviewModal
              productId={_id}
              setReviewModal={() => setReviewModal(false)}
              productRefetch={productRefetch}
            />
          )}

          {/* reviews */}
          <div className="flex max-sm:flex-col mt-10  w-full h-fit px-3">
            {/* rating */}
            <div className="w-full flex flex-col p-3 border h-fit mx-auto max-sm:w-11/12 border-violet-200 sm:w-2/5 rounded-md shadow-md justify-start items-center sm:mt-3">
              <div className="flex flex-col w-full  items-center mb-5">
                <div className=" ">
                  <Rating
                    name="half-rating-read"
                    value={avgRating}
                    precision={0.5}
                    readOnly
                  />
                </div>
                <h1 className="text-center my-1 text-gray-500 ">
                  {numOfReviews} reviews
                </h1>
                <div className="text-lg text-center max-md:text-base my-3">
                  {reviews.length > 0 ? (
                    <>
                      <p>
                        This product got average rating of{' '}
                        {avgRating.toFixed(1)}
                        /5
                      </p>
                    </>
                  ) : (
                    <p>{`No ratings yet. Be the first to review!`}</p>
                  )}
                </div>
              </div>

              <button
                className={`bg-uAccent ${
                  isAlreadyReviewed && 'opacity-60'
                }  w-4/5  mt-auto  py-2 flex flex-center gap-x-2 transition-all hover:shadow-lg sm:mx-10 rounded-lg text-md ${
                  isAlreadyReviewed && 'cursor-pointer'
                } whitespace-nowrap  h
              active:scale-95 text-white`}
                disabled={isAlreadyReviewed}
                onClick={addReview}
              >
                {isAlreadyReviewed ? (
                  'already reviewed!'
                ) : (
                  <span className="flex gap-x-2">
                    Add Review <MdRateReview className="mt-1 scale-125" />
                  </span>
                )}
              </button>
            </div>

            {/* reviews of the product */}
            <ProductReviews
              reviews={reviews}
              isLoading={isReviewsLoading}
              productId={productId}
            />
          </div>
        </section>
      )}
    </>
  )
}
export default ProductDetailsPage
