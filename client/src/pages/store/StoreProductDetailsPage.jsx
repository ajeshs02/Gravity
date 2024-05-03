import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProductById,
  getStoreProductReviews,
  storeProductImageAdd,
  storeProductImageDelete,
  storeProductImageUpdate,
} from '../../api/store'
import Rating from '@mui/material/Rating'
import ProductDetailsSkelton from '../../components/skelton/ProductDetailsSkelton'
import ProductReviews from '../../components/store/ProductReviews'
import { FaCloudUploadAlt, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import DeleteModal from '../../components/store/DeleteModal'
import UpdateProductModal from '../../components/store/UpdateProductModal'
import { FaRecycle } from 'react-icons/fa6'
import { TiDeleteOutline } from 'react-icons/ti'
import { CircularProgress } from '@mui/material'
import SEO from '../../Seo'
import { useToast } from '../../context/ToastContext'

const StoreProductDetailsPage = () => {
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [index, setIndex] = useState(0)

  const { id: productId } = useParams()

  const toast = useToast()

  const queryClient = useQueryClient()

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
      softDelete,
      avgRating = 0,
    } = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
  })

  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews', { productId }],
    queryFn: () => getStoreProductReviews(productId),
  })

  const { mutateAsync: updateProductImgMutation, isPending } = useMutation({
    mutationFn: (data) => storeProductImageUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', productId], { exact: true })
      toast('info', 'image update successful')
    },
    onError: () => {
      toast('error', 'image update failed')
    },
  })

  const { mutateAsync: deleteProductImgMutation, isPending: isDeletePending } =
    useMutation({
      mutationFn: (data) => storeProductImageDelete(data),
      onSuccess: () => {
        queryClient.invalidateQueries(['product', productId], { exact: true })
        toast('info', 'image deleted successfully')
      },
      onError: () => {
        toast('error', 'image delete failed')
      },
    })

  const { mutateAsync: addProductImgMutation, isPending: isAddPending } =
    useMutation({
      mutationFn: (data) => storeProductImageAdd(data),
      onSuccess: () => {
        queryClient.invalidateQueries(['product', productId], { exact: true })
        toast('info', 'image added successfully')
      },
      onError: () => {
        toast('info', 'image add failed')
      },
    })

  const handleImageAdd = async (event) => {
    if (event.target.files.length > 0) {
      const selectedImage = event.target.files[0]

      const formData = new FormData()
      formData.append('image', selectedImage)

      await addProductImgMutation({
        formData,
        productId: _id,
      })
    }
  }

  const handleImageDelete = async (productId, imageIndex, imagePublicId) => {
    await deleteProductImgMutation({
      productId,
      imageIndex,
      imagePublicId,
    })
  }

  const handleImageChange = async (
    event,
    productId,
    imageIndex,
    imagePublicId
  ) => {
    if (event.target.files.length > 0) {
      const selectedImage = event.target.files[0]

      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('imageIndex', imageIndex)
      formData.append('imagePublicId', imagePublicId)

      await updateProductImgMutation({
        formData,
        productId,
      })
    }
  }

  return (
    <>
      {isLoading ? (
        <>
          <SEO
            title={'Gravshop - Product Info Page'}
            description={'This is the product details page '}
          />
          <ProductDetailsSkelton />
        </>
      ) : (
        <section className="flex py-2 flex-col mt-14 pb-10 justify-center overflow-hidden transition-all ease-in-out">
          <SEO title={name + ' page'} description={description} />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-4 md:gap-x-6 lg:gap-x-10 sm:px-2 md:mx-4 p-2 w-full">
            {/* deleteModal */}
            {deleteModal && (
              <DeleteModal
                id={_id}
                name={name}
                softDelete={softDelete}
                setDeleteModal={setDeleteModal}
              />
            )}

            {/*Update Modal  */}
            {editModal && (
              <UpdateProductModal id={_id} setModal={setEditModal} />
            )}

            {/* ḷeft */}
            <div className=" flex flex-col self-start mx-auto max-h-fit items-center">
              <div className="relative object-cover  flex justify-center aspect-square  w-[350px] sm:w-[330px] rounded-md mb-5 md:w-[380px] lg:w-[530px] overflow-hidden shadow-md shadow-purple-100 p-2">
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
              <div
                className={`flex mx-auto w-fit justify-center  items-center gap-x-6  px-5 `}
              >
                {images.length > 0 &&
                  images.map((value, ind) => (
                    <div
                      className={`h-20 relative w-16 p-1  cursor-pointer hover:shadow-lg lg:h-28 lg:w-20 mx-auto flex justify-center items-center bg-white border-2 border-purple-${
                        index === ind ? '600' : '50'
                      }  rounded-xl  `}
                      key={ind}
                      // onMouseOver={() => setIndex(ind)}
                    >
                      {!isPending &&
                        !isDeletePending &&
                        !isAddPending &&
                        images.length > 1 && (
                          <button
                            aria-label="delete image"
                            className="absolute  bg-red-600 rounded-full -right-2 -top-2"
                            onClick={() =>
                              handleImageDelete(_id, ind, value.public_id)
                            }
                            disabled={isDeletePending}
                          >
                            <TiDeleteOutline className="scale-150 text-white" />
                          </button>
                        )}
                      <img
                        loading="lazy"
                        src={value.url}
                        alt={value.url}
                        className={`object-contain h-full min-h-fit border-purple-${
                          index === ind ? '500' : '50'
                        } ${
                          (isPending || isDeletePending || isAddPending) &&
                          'opacity-50 cursor-wait'
                        }`}
                        onClick={() => setIndex(ind)}
                      />
                      {!isPending && !isDeletePending && !isAddPending && (
                        <label
                          className={`absolute -right-4 -bottom-4 h-6 w-6 aspect-square flex flex-col  items-center justify-center border bg-orange-600 border-white rounded-full  text-2xl text-white mb-2 hover:cursor-pointer`}
                        >
                          <input
                            type="file"
                            className="hidden"
                            name="image"
                            onChange={(event) =>
                              handleImageChange(
                                event,
                                _id,
                                ind,
                                value.public_id
                              )
                            }
                            disabled={isPending}
                            accept="image/*"
                          />
                          <FaEdit className="scale-[0.6]" />
                        </label>
                      )}
                    </div>
                  ))}
                {images.length < 4 && (
                  <label
                    className={`h-20 relative w-16 p-1  cursor-pointer hover:shadow-lg lg:h-28 lg:w-20 mx-auto flex justify-center items-center bg-gray-100 border-sAccent/50 border-2 rounded-xl text-sAccent ${
                      isAddPending && 'cursor-wait'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleImageAdd}
                      accept="image/*"
                      disabled={images.length >= 4}
                    />
                    {isAddPending ? (
                      <div className="w-full h-full flex flex-center">
                        <CircularProgress />
                      </div>
                    ) : (
                      <div className="flex flex-col flex-center gap-y-1">
                        <FaCloudUploadAlt className="scale-150" />
                        <span className="text-sm"> Add</span>
                      </div>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* right */}
            <div className="flex gap-y-2  md:px-4 mr-3 flex-col self-start w-full mx-auto px-2 mt-6 relative ">
              {softDelete ? (
                <div className="w-full flex justify-end absolute -top-0 sm:-top-9 right-0 gap-x-4 ">
                  <button
                    aria-label="recycle"
                    onClick={() => setDeleteModal(true)}
                  >
                    <FaRecycle className="scale-150 text-green-600" />
                  </button>
                </div>
              ) : (
                <div className="w-full flex justify-end absolute -top-0 sm:-top-9 right-0 gap-x-4 ">
                  <button aria-label="edit" onClick={() => setEditModal(true)}>
                    <FaEdit className="scale-150" />
                  </button>
                  <button
                    aria-label="delete"
                    onClick={() => setDeleteModal(true)}
                  >
                    <MdDelete className="scale-150 text-red-600" />
                  </button>
                </div>
              )}
              <h1 className="text-xl font-medium capitalize max-sm:max-w-90%] ">
                {name}
              </h1>

              {/* rating */}
              <a
                href="#reviews"
                className="flex gap-x-3 max-md:flex-col whitespace-nowrap text-sky-600"
              >
                <Rating
                  name="half-rating-read"
                  defaultValue={avgRating || 0}
                  precision={0.5}
                  readOnly
                />
                {numOfReviews !== 0 ? (
                  <p className="whitespace-nowrap">({numOfReviews})</p>
                ) : (
                  <p>No ratings yet</p>
                )}
              </a>
              {/* brand */}
              <p className="text-xs text-black">Brand: {brand}</p>
              {/* price */}
              {discount && discount > 0 ? (
                <div className="flex gap-x-3   mt-3 gap-y-0 mb-2">
                  <div className="flex">
                    <p className="font-semibold">{'\u20B9 '}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {`${Math.round(
                        (price * (100 - discount)) / 100
                      ).toLocaleString('en-IN')}`}
                    </p>
                  </div>
                  <div className="flex mt-1 pt-1 text-gray-600 line-through">
                    <p className="font-medium text-xs">{'\u20B9 '}</p>
                    <p className="text-sm sm:text-md  font-medium  h-3 ">{`${price.toLocaleString(
                      'en-IN'
                    )}`}</p>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <span className="mt-2 font-semibold">{'\u20B9 '}</span>
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
                  {stock}
                </p>
              </div>

              {/* description */}
              <div className="bg-red-100 flex flex-col p-1 py-3 my-3 items-start rounded-lg">
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
            </div>
          </div>

          {/* reviews */}
          <ProductReviews
            reviews={reviews}
            isLoading={isReviewsLoading}
            productId={productId}
            user="store"
          />
        </section>
      )}
    </>
  )
}
export default StoreProductDetailsPage
