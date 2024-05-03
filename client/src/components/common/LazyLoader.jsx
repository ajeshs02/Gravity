const LazyLoader = () => {
  return (
    <div className="h-96 flex flex-center">
      <img
        src="/loading.svg"
        alt="loading..."
        width={40}
        height={40}
        className="mx-auto"
      />
    </div>
  )
}
export default LazyLoader
