import CardSkelton from '../skelton/CardSkelton'

const HomeSection = ({ title, isLoading, items, message, Card }) => {
  return (
    <section className="h-auto border-b-2 p-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
        {title}
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-0 h-auto  ">
          {Array(3)
            .fill()
            .map((_, index) => (
              <CardSkelton key={index} />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-0 h-auto ">
          {items.length > 0 ? (
            items.map((item) => <Card item={item} key={item._id} />)
          ) : (
            <div className="w-full  h-96 flex text-center">
              <p className="text-xl font-semibold text-gray-600">{message}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
export default HomeSection
