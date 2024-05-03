import { Link } from 'react-router-dom'
import SEO from '../../Seo'

const NotFound = () => (
  <section className="w-full h-full mt-36 flex flex-col flex-center">
    <SEO title={`Oops! Page not found`} description={'Page not found'} />
    <h1 className="text-3xl mb-6">404 - Not Found!</h1>
    <Link to="/" className="text-blue-500 hover:underline">
      Go Home
    </Link>
  </section>
)

export default NotFound
