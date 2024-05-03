import { FaStar } from 'react-icons/fa6'
import { AiFillDelete } from 'react-icons/ai'
import { IoMdCloseCircle } from 'react-icons/io'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FormField from '../form/FormField'
import FormTextArea from '../form/FormTextArea'
import FormDropdown from '../form/FormDropdown'
import { useEffect, useState } from 'react'
import { productSchema } from '../../schema/zodSchema'
import { addNewProduct, getProductById, updateProduct } from '../../api/store'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const UpdateProductModal = ({ setModal, id }) => {
  const queryClient = useQueryClient()

  const {
    data: {
      _id,
      name,
      category,
      brand,
      description,
      discount,
      price,
      stock,
    } = {},
    isLoading: isProductLoading,
    refetch,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setError,
    setValue,
  } = useForm({ resolver: zodResolver(productSchema) })

  useEffect(() => {
    if (!isProductLoading) {
      setValue('name', name)
      setValue('category', category)
      setValue('brand', brand)
      setValue('description', description)
      setValue('discount', discount.toString())
      setValue('price', price.toString())
      setValue('stock', stock.toString())
    }
  }, [isProductLoading])

  const onSubmit = async (productData) => {
    try {
      const data = await updateProduct(_id, productData)
      if (data.success) {
        queryClient.invalidateQueries(['storeProducts', 'product', id])
        setModal()
      }
    } catch (error) {
      alert('Failed to add product!')
      console.error(error)
    }
  }

  return (
    <div className="fixed left-0 right-0 bottom-0 top-0 z-20  bg-black/70 flex-center w-full">
      <button
        aria-label="close modal"
        onClick={() => setModal(false)}
        className="absolute right-2 lg:right-6  top-2 lg:top-4"
      >
        <IoMdCloseCircle className="w-8 h-8 text-white hover:text-sAccent transition-all " />
      </button>
      <div className="h-[92vh]  overflow-hidden  w-full mx-2 sm:w-[85%] md:w-3/4 lg:max-w-[70%] xl:w-3/5  rounded-3xl bg-primary p-4 pb-20">
        <h1 className="text-2xl text-center font-bold text-sAccent my-2">
          Update Product
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
            {/* Product Discount */}
            <FormField
              user="store"
              type="number"
              placeholder="Enter product discount (%)"
              name="discount"
              id="discount"
              label="Product Discount (optional)"
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
              {isSubmitting || isLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default UpdateProductModal
