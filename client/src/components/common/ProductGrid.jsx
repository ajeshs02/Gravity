import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import ProductCard from '../../components/user/ProductCard'
import CardSkelton from '../skelton/CardSkelton'
import { IoMdGrid } from 'react-icons/io'
import { Link } from 'react-router-dom'

const ProductsGrid = ({ fn, link = '/product', user = 'user' }) => {
  const {
    data: products,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => fn(),
  })

  // useEffect(() => {
  //   refetch()
  // }, [selectedCategory])

  return (
    <section className="w-full  h-auto min-h-[80vh] relative">
      <div className="w-full">
        <div className="flex flex-center w-full mb-6 text-xl gap-x-2 font-bold ">
          Products <IoMdGrid />
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-0 h-auto  ">
            {Array(4)
              .fill()
              .map((_, index) => (
                <CardSkelton key={index} />
              ))}
          </div>
        ) : (
          <>
            <div
              className={`${
                products.products.length > 0 && 'grid'
              } w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-0 "`}
            >
              {products.products.length > 0 ? (
                products.products.map((product) => (
                  <ProductCard item={product} key={product._id} link={link} />
                ))
              ) : user !== 'store' ? (
                <div className="w-full  h-44  flex flex-center text-xl font-medium text-gray-700   ">
                  No Products Found.
                </div>
              ) : (
                <div className="!w-full  h-44  flex flex-center text-xl font-medium text-gray-700  ">
                  No Products Found. &nbsp;
                  <Link
                    to={'/store/products'}
                    className="hover:underline text-red-400 hover:text-sAccent"
                  >
                    Add ?
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
export default ProductsGrid
