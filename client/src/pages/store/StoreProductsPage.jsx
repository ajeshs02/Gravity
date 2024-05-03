import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import AddProductModal from '../../components/store/AddProductModal'
import StoreProductCard from '../../components/store/StoreProductCard'
import ProductCategories from '../user/Categories'
import { getStoreProducts } from '../../api/store'
import Pagination from '@mui/material/Pagination'
import CategoryFilter from '../../components/user/CategoryFilter'
import { CircularProgress } from '@mui/material'
import { FaPlus } from 'react-icons/fa'
import SEO from '../../Seo'

const StoreProducts = () => {
  const [modal, setModal] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['storeProducts', selectedCategory, { page }],
    queryFn: () => getStoreProducts(selectedCategory, page),
  })

  const handleCategorySelection = (category) => {
    setSelectedCategory(category)
    window.scrollTo(0, 0)
    refetch()
  }
  // useEffect(() => {
  //   if (!isLoading) {
  //     console.log(products)
  //   }
  // }, [isLoading])

  return (
    <section className="w-full  h-auto min-h-[80vh] relative pb-5">
      <>
        <CategoryFilter
          handleCategorySelection={handleCategorySelection}
          selectedCategory={selectedCategory}
        />
        {isLoading ? (
          <div className="w-full min-h-72 flex justify-center items-center gap-y-4 font-medium ">
            <CircularProgress style={{ scale: '1.5' }} />
          </div>
        ) : (
          <>
            <SEO
              title={`Store Products - ${
                selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)
              }`}
              description={'This is the store product page '}
            />
            <div
              className={`${
                products.products.length > 0 && 'grid'
              } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-0  pb-10`}
            >
              {products.products.length > 0 ? (
                products.products.map((product) => (
                  <StoreProductCard product={product} key={product._id} />
                ))
              ) : (
                <div className="w-full  h-44 flex flex-center">
                  <p className="text-xl font-semibold text-gray-600">{`No Products found `}</p>
                </div>
              )}
            </div>

            <div className="w-full flex  justify-center absolute bottom-3">
              <Pagination
                count={products?.totalPages}
                page={page}
                onChange={(event, value) => {
                  setPage(value)
                  window.scrollTo(0, 0)
                }}
              />
            </div>
          </>
        )}
        {/* modal and modal open button */}
        {modal && <AddProductModal setModal={() => setModal(false)} />}
        <button
          aria-label="add product"
          className="fixed right-10 bottom-10 flex-center  rounded-full p-0 drop-shadow-lg hover:drop-shadow-xl  w-12 h-12 bg-sAccent text-white font-extrabold text-4xl hover:scale-105 transition-all z-10"
          onClick={() => setModal(true)}
        >
          <FaPlus className="scale-75" />
        </button>
      </>
    </section>
  )
}
export default StoreProducts
