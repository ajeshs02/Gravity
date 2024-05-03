import { useQuery } from '@tanstack/react-query'
import { getProducts, getStores } from '../../api/user'
import ProductCard from '../../components/user/ProductCard'
import StoreCard from '../../components/user/StoreCard'
import HomeSection from '../../components/user/HomeSection'
import SEO from '../../Seo'

const HomePage = () => {
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products', 'topProducts'],
    queryFn: () =>
      getProducts({ sortBy: 'avgRating', order: 'desc', limit: 4 }),
  })

  const { data: stores, isLoading: isStoreLoading } = useQuery({
    queryKey: ['topStores'],
    queryFn: () => getStores({ top: true, limit: 4 }),
  })

  const { data: wishlisted, isLoading: isWishListedLoading } = useQuery({
    queryKey: ['products', 'wishlist'],
    queryFn: () =>
      getProducts({
        sortBy: 'likes',
        order: 'desc',
        limit: 4,
        wishlist: 'true',
      }),
  })

  return (
    <section className="w-full  max-h-fit min-h-[80vh] relative flex flex-col gap-y-8 pb-24 bg-primary">
      <SEO
        title={'Gravshop - Home Page'}
        description={'Gravshop - Online shopping site for mobile and website '}
      />
      <>
        {/* top rated products */}
        <HomeSection
          title={'Top Rated Products'}
          isLoading={isProductsLoading}
          items={products?.products}
          message={'No Products Found'}
          Card={ProductCard}
        />

        {/* top rated stores */}
        <HomeSection
          title={'Top Rated Stores'}
          isLoading={isStoreLoading}
          items={stores?.stores}
          message={'No Stores Found'}
          Card={StoreCard}
        />

        {/* Most Wish-listed products */}
        <HomeSection
          title={'Wish-Listed Products'}
          isLoading={isWishListedLoading}
          items={wishlisted?.products}
          message={'No Products Found'}
          Card={ProductCard}
        />
      </>
    </section>
  )
}
export default HomePage
