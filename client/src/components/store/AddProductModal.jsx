import { FaStar } from 'react-icons/fa6'
import { AiFillDelete } from 'react-icons/ai'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { IoMdCloseCircle } from 'react-icons/io'
import FormField from '../form/FormField'
import FormTextArea from '../form/FormTextArea'
import FormDropdown from '../form/FormDropdown'
import { useEffect, useState } from 'react'
import { productSchema } from '../../schema/zodSchema'
import { addNewProduct } from '../../api/store'
import ImageUpload from '../form/ImageUpload'
import { useQueryClient } from '@tanstack/react-query'

const AddProductModal = ({ setModal }) => {
  const [images, setImages] = useState([])
  const [imageError, setImageError] = useState(false)

  const queryClient = useQueryClient()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(productSchema) })

  const onSubmit = async (productData) => {
    if (images.length === 0) {
      setImageError(true)
      return
    } else {
      setImageError(false)
      try {
        const formData = new FormData()

        images.forEach((img) => {
          formData.append('images', img)
        })

        Object.entries(productData).forEach(([key, value]) => {
          formData.append(key, value)
        })

        // console.log('images', images)
        // console.log('productData', productData)

        const data = await addNewProduct(formData)
        if (data.success) {
          queryClient.invalidateQueries(['storeProducts'])
          setModal()
        }
      } catch (error) {
        alert('Failed to add product!')
        console.error(error)
      }
    }
  }

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      const newImages = Array.from(event.target.files)

      const combinedImages = [...images, ...newImages].slice(0, 4)

      setImages(combinedImages)
    }

    setImageError(false)
  }

  const handleSetMainImage = (mainImage) => {
    const filteredImages = images.filter((image) => image !== mainImage)
    const newImages = [mainImage, ...filteredImages]
    setImages(newImages)
  }

  const handleDelete = (imageToDelete) => {
    const filteredImages = images.filter((image) => image !== imageToDelete)

    if (imageToDelete === images[0] && filteredImages.length > 0) {
      const newMainImage = filteredImages[0]
      handleSetMainImage(newMainImage)
    }

    setImages(filteredImages)

    if (filteredImages.length === 0) {
      setImageError(true)
    } else {
      setImageError(false)
    }
  }

  return (
    <div className="fixed left-0 right-0 bottom-0 top-0 z-20  bg-black/70 flex-center w-full">
      <button
        onClick={setModal}
        aria-label="Add Product"
        className="absolute right-2 lg:right-6  top-2 lg:top-4"
      >
        <IoMdCloseCircle className="w-8 h-8 text-white hover:text-sAccent transition-all " />
      </button>
      <div className="h-[92vh]  overflow-hidden  w-full mx-2 sm:w-[85%] md:w-3/4 lg:max-w-[70%] xl:w-3/5  rounded-3xl bg-primary p-4 pb-20">
        <h1 className="text-2xl text-center font-bold text-sAccent my-2">
          Add Product
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto  h-full flex flex-col gap-x-2 lg:gap-x-5 lg:flex-row w-full  bg-inherit mt-2 px-2 pt-4 6"
        >
          {/* right */}
          <div className="w-full lg:w-2/4">
            {/* Product Name */}
            <FormField
              user="store"
              type="text"
              placeholder="Enter product name"
              name="name"
              id="name"
              label="Product Name"
              register={register}
              error={errors.name}
            />
            {/* Description */}
            <FormTextArea
              user="store"
              placeholder="Enter product description. Maximum 300 characters"
              name="description"
              id="description"
              label="Product Description"
              register={register}
              error={errors.description}
              row={4}
            />
            {/* Product Category */}
            <FormDropdown
              control={control}
              name="category"
              label="Product Category"
              error={errors.category}
              setError={setError}
            />
            {/* Product Brand */}
            <FormDropdown
              control={control}
              name="brand"
              label="Product Brand"
              error={errors.brand}
              setError={setError}
            />

            {/* Product Price */}
            <FormField
              user="store"
              type="number"
              placeholder="Enter product price"
              name="price"
              id="price"
              label="Product Price"
              register={register}
              error={errors.price}
            />
          </div>
          {/* right */}
          <div className="w-full lg:w-2/4 h-full  ">
            {/* image preview */}
            {images.length > 0 && (
              <div className="mb-3">
                <div className="h-20 flex gap-x-1">
                  {images.map((image, i) => (
                    <div
                      key={i}
                      className={`h-full w-20 relative rounded-lg overflow-hidden shadow-md ${
                        i === 0 && 'border-4 border-sAccent '
                      }`}
                    >
                      <button
                        aria-label="Delete Image"
                        onClick={() => handleDelete(image)}
                        className="bg-black rounded-full w-5 h-5 flex-center absolute right-1 top-1"
                      >
                        <AiFillDelete className="text-red-500" />
                      </button>
                      <button
                        aria-label="set as main image"
                        onClick={() => handleSetMainImage(image)}
                        className=" rounded-full w-5 h-5 flex-center absolute bottom-1 left-1"
                      >
                        <FaStar
                          className={`text-white ${
                            i === 0 && 'text-yellow-500'
                          } border-black shadow-md`}
                        />
                      </button>
                      <img
                        className="h-full w-full object-center max-w-full max-h-full object-cover"
                        src={URL.createObjectURL(image)}
                        alt="selected image"
                        loading="lazy"
                      />
                    </div>
                  ))}
                  <span className="text-gray-500 text-right ml-auto text-xs mt-auto">
                    (can add upto 4 images )
                  </span>
                </div>
                <span className="text-gray-500 text-xs">
                  &#11088; denotes main image of the product
                </span>
              </div>
            )}
            {/* upload box */}
            <ImageUpload
              images={images}
              register={register}
              handleImageChange={handleImageChange}
              imageError={imageError}
            />

            {/* Product Discount */}
            <FormField
              user="store"
              type="number"
              placeholder="Enter product discount (%)"
              name="discount"
              id="discount"
              label="Product Discount"
              register={register}
              error={errors.discount}
            />
            {/* Product Stock */}
            <FormField
              user="store"
              type="number"
              placeholder="Enter product stock"
              name="stock"
              id="stock"
              label="Product Stock (in number)"
              register={register}
              error={errors.stock}
            />

            {/* submit */}
            <button
              disabled={isSubmitting || isLoading}
              type="submit"
              className={`h-12  transition-all border w-full  my-4 rounded-xl border-sAccent font-bold bg-sAccent/90 hover:bg-sAccent text-white ${
                (isSubmitting || isLoading) && 'bg-gray-500 hover:bg-gray-500'
              } `}
            >
              {isSubmitting || isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddProductModal
