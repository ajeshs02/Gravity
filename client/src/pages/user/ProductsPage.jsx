import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import ProductCard from '../../components/user/ProductCard'
import { getProducts } from '../../api/user'
import CardSkelton from '../../components/skelton/CardSkelton'
import { IoClose } from 'react-icons/io5'
import SEO from '../../Seo'

const ProductsPage = () => {
  const [page, setPage] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [isWishListed, setIsWishListed] = useState(false)

  const [searchParams] = useSearchParams()

  let category = searchParams.get('category')
  let brand = searchParams.get('brand')
  let search = searchParams.get('search')

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      'products',
      selectedCategory,
      selectedFilter,
      selectedBrand,
      isWishListed,
      { page },
      search,
    ],
    queryFn: () =>
      getProducts({
        category: selectedCategory,
        sortBy: selectedFilter === 'Top Rated' && 'avgRating',
        page,
        brand: selectedBrand,
        wishlist: isWishListed,
        search,
      }),
  })

  useEffect(() => {
    if (search) {
      reset()
    } else {
      if (category) {
        setSelectedCategory(category)
      }
      if (brand) {
        setSelectedBrand(brand)
      }
    }
    refetch()
  }, [selectedCategory, selectedFilter, selectedBrand, search])

  const filters = [
    { id: 1, name: 'All', value: 'all' },
    { id: 2, name: 'Top Rated', value: 'avgRating' },
    { id: 3, name: 'Wish-Listed', value: 'wishlisted' },
  ]

  const categoryClass = `w-fit px-2 h-full cursor-pointer capitalize   rounded-xl my-1 text-center flex flex-center font-medium text-uAccent hover:bg-uAccent border-uAccent
   hover:text-white border  mx-1 transition-all `

  const categoryStyle = (value) => {
    if (value === selectedFilter) {
      return `${categoryClass} bg-uAccent text-white`
    } else {
      return `${categoryClass}`
    }
  }

  const reset = () => {
    searchParams.delete('category')
    searchParams.delete('brand')
    window.history.pushState({}, '', '?' + searchParams.toString())
    setSelectedCategory('')
    setSelectedBrand('')
  }

  const handleSelectedFilter = (value) => {
    if (value === 'wishlisted') {
      setSelectedFilter('Wish-Listed')
      reset()
      setIsWishListed(true)
    } else if (value === 'all') {
      setSelectedFilter('All')
      setIsWishListed(false)
    } else {
      setSelectedFilter('Top Rated')
      setIsWishListed(false)
    }
  }

  return (
    <section className="w-full  h-auto min-h-[80vh] relative pb-20">
      <SEO
        title={`Products - ${
          category ? category : brand ? brand : search ? search : selectedFilter
        }`}
        description={'This is user products page'}
      />
      <>
        {(selectedBrand || selectedCategory) && (
          <p className="text-lg  mb-8 flex ">
            Search Results for{' '}
            <span className="font-semibold ml-2 italic">
              {' '}
              "{selectedBrand || selectedCategory}"
            </span>
            <button
              aria-label="close"
              onClick={() => reset()}
              className="flex flex-center  ml-2 mt-[5px] w-5 h-5 bg-red-500 text-white border aspect-square rounded-full"
            >
              <IoClose className="w-fit mx-auto" />
            </button>
          </p>
        )}
        {!selectedBrand && !category && (
          <div className="w-full h-8 flex my-4 mb-8 flex-center overflow-x-auto overflow-y-hidden">
            {filters.map((item) => (
              <button
                key={item.id}
                className={categoryStyle(item.name)}
                onClick={() => handleSelectedFilter(item.value)}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-0 ">
              {products?.products.length > 0 ? (
                products?.products.map((product) => (
                  <ProductCard item={product} key={product._id} />
                ))
              ) : (
                <div className="w-full  h-96 flex text-center">
                  <p className="text-xl font-semibold text-gray-600">{`No Products found `}</p>
                </div>
              )}
            </div>

            <div className="w-full flex  justify-center absolute bottom-2">
              <Pagination
                count={products?.totalPages || 1}
                page={page}
                onChange={(event, value) => {
                  setPage(value)
                  window.scrollTo(0, 0)
                }}
              />
            </div>
          </>
        )}
      </>
    </section>
  )
}
export default ProductsPage
