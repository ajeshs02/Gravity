import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import { getStores } from '../../api/user'
import StoreCard from '../../components/user/StoreCard'
import CardSkelton from '../../components/skelton/CardSkelton'
import SEO from '../../Seo'

const StoresPage = () => {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('All')

  const [isFollowing, setIsFollowing] = useState(false)

  const {
    data: response,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [isFollowing, { page }],
    queryFn: () => getStores({ page, isFollowing }),
  })

  const handleCategorySelection = (category) => {
    setCategory(category)
    if (category === 'Stores you follow') {
      setIsFollowing(true)
    } else {
      setIsFollowing(false)
    }
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    refetch()
  }, [category, isFollowing])

  const categories = ['All', 'Stores you follow']

  const categoryClass = `w-fit px-2 h-full cursor-pointer capitalize   rounded-xl my-1 text-center flex flex-center font-medium text-uAccent hover:bg-uAccent border-uAccent hover:text-white border  mx-1 transition-all `

  const categoryStyle = (cat) => {
    if (cat === category) {
      return `${categoryClass} bg-uAccent text-white`
    } else {
      return `${categoryClass}`
    }
  }

  return (
    <section className="w-full  h-auto min-h-[80vh] relative">
      <>
        <div className="w-full h-8 flex my-8 flex-center overflow-x-auto overflow-y-hidden">
          {categories.map((category) => (
            <button
              key={category}
              className={categoryStyle(category)}
              onClick={() => handleCategorySelection(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-0 h-auto  ">
            <SEO title={`Store Page`} description={'This is store page'} />
            {Array(4)
              .fill()
              .map((_, index) => (
                <CardSkelton key={index} />
              ))}
          </div>
        ) : (
          <>
            <SEO
              title={`Store Page - ${category}`}
              description={'This is store page'}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-0 ">
              {response.stores.length > 0 ? (
                response.stores.map((store) => (
                  <StoreCard item={store} key={store._id} />
                ))
              ) : (
                <div className="w-full  h-96 flex text-center">
                  <p className="text-xl font-semibold text-gray-600">{`No Stores found `}</p>
                </div>
              )}
            </div>

            <div className="w-full flex  justify-center absolute bottom-0">
              <Pagination
                count={response.totalPages || 1}
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
export default StoresPage
