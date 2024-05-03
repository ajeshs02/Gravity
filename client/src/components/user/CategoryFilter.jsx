import { useQuery } from '@tanstack/react-query'
import { getProductCategories } from '../../api/store'
import { useEffect, useState } from 'react'

const CategoryFilter = ({
  handleCategorySelection,
  selectedCategory,
  user = 'store',
}) => {
  const [productCategories, setProductCategories] = useState(['All'])
  const { data: categories, isLoading } = useQuery({
    queryKey: ['storeProductCategories'],
    queryFn: () => getProductCategories(),
  })

  useEffect(() => {
    if (!isLoading) {
      setProductCategories([...categories.categories, 'Deleted'])
    }
  }, [isLoading])

  const categoryClass = `w-fit px-2 h-full cursor-pointer capitalize   rounded-xl my-1 text-center flex flex-center font-medium ${
    user === 'user'
      ? 'text-uAccent hover:bg-uAccent border-uAccent'
      : 'text-sAccent hover:bg-sAccent border-sAccent'
  }  hover:text-white border   mx-1 transition-all `

  const categoryStyle = (category) => {
    if (category === selectedCategory) {
      return `${categoryClass} ${
        user === 'user' ? 'bg-uAccent' : 'bg-sAccent'
      } ${category === 'Deleted' && '!bg-red-600 '}  text-white`
    } else {
      return `${categoryClass}`
    }
  }

  return (
    <div className="w-full h-8 flex my-8 flex-center">
      {isLoading ? (
        <h4>Loading...</h4>
      ) : productCategories.length > 0 ? (
        productCategories.map((category) => (
          <button
            key={category}
            className={categoryStyle(category)}
            onClick={() => handleCategorySelection(category)}
          >
            {category}
          </button>
        ))
      ) : (
        <h3>Error loading categories</h3>
      )}
    </div>
  )
}
export default CategoryFilter
