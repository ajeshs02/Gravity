import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const LoadMore = () => {
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
    }
  }, [inView])

  return (
    <section>
      <div ref={ref}>
        <img
          src="/loading.svg"
          alt="loading..."
          width={20}
          height={20}
          className="mx-auto"
        />
      </div>
    </section>
  )
}
export default LoadMore
