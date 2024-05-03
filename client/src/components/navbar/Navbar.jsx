import { useCallback, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaSearch } from 'react-icons/fa'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoginPage } from '../../state/slices/formSlice'

import UserLogoutModal from '../user/UserLogoutModal'

const Navbar = ({ navbarLinks, sidebarLinks, user = 'user' }) => {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)

  let querySearch = searchParams.get('search')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const location = useLocation()
  const page = location.pathname
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const subLinks = [
    { id: 1, name: 'All', to: '/' },
    { id: 2, name: 'Products', to: '/browse' },
    { id: 3, name: 'Stores', to: '/stores' },
    { id: 4, name: 'Categories', to: '/categories' },
    { id: 5, name: 'Brands', to: '/brand' },
  ]

  const isSelected = (name, link) => {
    if (name === 'Home') {
      if (
        page === '/' ||
        page === '/store' ||
        page === '/browse' ||
        page === '/stores' ||
        page === '/categories' ||
        page === '/brand'
      ) {
        return true
      }
    } else {
      return page === link
    }
  }

  const isSubNavbarVisible = () => {
    if (
      page === '/' ||
      page === '/browse' ||
      page === '/stores' ||
      page === '/categories' ||
      page === '/brand'
    ) {
      return true
    }
    return false
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (search.trim() === '') {
      navigate(`/browse`)
    } else {
      navigate(`/browse?search=${search}`)
    }
  }

  // function debounce(func, delay) {
  //   let debounceTimer
  //   return function () {
  //     const context = this
  //     const args = arguments
  //     clearTimeout(debounceTimer)
  //     debounceTimer = setTimeout(() => func.apply(context, args), delay)
  //   }
  // }

  // const debouncedNavigation = useCallback(
  //   debounce((value) => {
  //     if (value.trim() === '') {
  //       navigate(`/browse`)
  //     } else {
  //       navigate(`/browse?search=${value}`)
  //     }
  //   }, 500),
  //   [navigate]
  // )

  // useEffect(() => {
  //   if (search.trim() !== '') {
  //     debouncedNavigation(search)
  //   }
  // }, [search, debouncedNavigation])

  return (
    <header className="fixed top-0 left-0 right-0 min-h-16 h-auto flex flex-col justify-center pt-2  bg-primary z-20 shadow-sm rounded-b-lg ">
      {logoutModal && <UserLogoutModal setLogoutModal={setLogoutModal} />}
      {/* main navbar */}
      <div className=" flex justify-between items-center px-5 md:px-14">
        {/* left */}
        <Link
          to={user === 'user' ? '/' : '/store'}
          className="flex-center gap-1"
        >
          <p className="text-lg tracking-widest max-sm:hidden">GravShop</p>
          <img
            src="/gravshop.webp"
            alt="logo"
            loading="lazy"
            width={45}
            height={45}
            style={{ filter: 'invert(100%)' }}
          />
        </Link>
        {/* middle */}
        {user === 'user' && (
          <div className="flex gap-2 w-3/6 lg:w-2/6">
            <input
              type="text"
              placeholder="search product"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                if (e.target.value.trim() === '') {
                  navigate(`/browse`)
                }
              }}
              className={`!rounded-3xl  ${
                user === 'user'
                  ? 'border !border-uAccent/50 focus:outline-uAccent  '
                  : 'border !border-sAccent/50 focus:outline-sAccent'
              } bg-white`}
            />
            <button
              className={`rounded-full bg-gray-200 w-9 h-9 aspect-square my-auto flex-center   hover:text-white transition-all ${
                user === 'user'
                  ? 'text-uAccent hover:bg-uAccent'
                  : 'text-sAccent hover:bg-sAccent'
              }`}
              onClick={handleSearchSubmit}
              aria-label="Search"
            >
              <FaSearch className="scale-110 " />
            </button>
          </div>
        )}
        {/* right */}
        <nav className="hidden lg:block ml-4">
          <div className="flex gap-x-2">
            <ul className="flex gap-x-4">
              {navbarLinks.map((item) => (
                <li
                  key={item.link}
                  className={`${
                    user === 'user'
                      ? 'hover:text-uAccent'
                      : 'hover:text-sAccent'
                  } ${
                    isSelected(item.text, item.link) &&
                    (user === 'user' ? 'text-uAccent' : 'text-sAccent')
                  } `}
                >
                  <Link to={item.link}>{item.text}</Link>
                </li>
              ))}
              <li>
                <button
                  className={`${
                    user === 'user'
                      ? 'hover:text-uAccent'
                      : 'hover:text-sAccent'
                  } `}
                  onClick={
                    user === 'store'
                      ? () => {
                          dispatch(setLoginPage('StoreLogin'))
                          setLogoutModal(true)
                        }
                      : () => {
                          dispatch(setLoginPage('UserLogin'))

                          setLogoutModal(true)
                        }
                  }
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>
        {/* sidebar */}
        <button
          aria-label="Hamburger"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <GiHamburgerMenu
            className={` h-6 w-6 ${
              user === 'user' ? 'hover:text-uAccent' : 'hover:text-sAccent'
            } `}
          />
        </button>
        {isSidebarOpen && (
          <div
            className="lg:hidden  fixed top-0 left-0 w-full h-full bg-black/50 !z-[100]"
            onClick={toggleSidebar}
          />
        )}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          sidebarLinks={sidebarLinks}
          page={page}
          user={user}
          setLogoutModal={setLogoutModal}
          isSelected={isSelected}
        />
      </div>
      {/* sub navbar */}
      {isSubNavbarVisible() && user === 'user' && (
        <div className="w-full mt-2 py-[5px] bg-slate-700 px-5 md:px-14 rounded">
          {subLinks.map((link) => (
            <Link
              to={link.to}
              key={link.id}
              className={` text-white p-1 px-2 mr-2 rounded-md ${
                page === link.to && 'bg-uAccent text-white'
              } `}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
export default Navbar
