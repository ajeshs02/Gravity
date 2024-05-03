import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductCategories } from '../../api/user'
import Loading from '../../components/common/Loading'
import { motion } from 'framer-motion'
import SEO from '../../Seo'

const Categories = () => {
  const navigate = useNavigate()

  const location = useLocation()

  const type = location.pathname === '/categories' ? 'category' : 'brand'

  const { data: categories, isLoading } = useQuery({
    queryKey: ['storeProductCategories', type],
    queryFn: () => getProductCategories(type),
  })

  const handleCategorySelection = (category) => {
    if (type === 'category') {
      navigate(`/browse?category=${category}`)
    } else if (type === 'brand') {
      navigate(`/browse?brand=${category}`)
    }
  }

  const transition = { type: 'spring', duration: 0.3 }

  return (
    <section className="w-full  h-auto ">
      <h1 className="text-xl font-bold mb-5 text-center">
        {type === 'category'
          ? 'Browse By Product Categories'
          : 'Browse By Brand'}
      </h1>
      {isLoading ? (
        <>
          <SEO
            title={`${
              type === 'category' ? 'Product Categories' : 'Product Brand'
            }`}
            description={'Search By Category or Brand'}
          />
          <Loading />
        </>
      ) : categories.categories.length > 0 ? (
        <div className=" grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 overflow-hidden gap-2 p-2">
          <SEO
            title={`${
              type === 'category' ? 'Product Categories' : 'Product Brand'
            }`}
            description={'Search By Category or Brand'}
          />
          {categories?.categories.map((category) => (
            <motion.button
              initial={{ opacity: 0.8 }}
              whileInView={{ opacity: 1 }}
              transition={{ ...transition, type: 'tween' }}
              whileHover={{
                scale: 1.05,
                shadow: 'black',
                transition: { duration: 0.1 },
              }}
              whileTap={{ scale: 0.95 }}
              key={category}
              className={
                'bg-secondary shadow-lg border t rounded-xl  aspect-square text-uAccent flex flex-center transition-all   w-full h-36 font-semibold text-lg capitalize'
              }
              onClick={() => handleCategorySelection(category)}
            >
              {category}
            </motion.button>
          ))}
        </div>
      ) : (
        <h3>Failed to load categories</h3>
      )}
    </section>
  )
}
export default Categories
