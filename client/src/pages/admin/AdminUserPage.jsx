import { useQuery } from '@tanstack/react-query'
import CartSkelton from '../../components/skelton/CartSkelton'
import { adminViewUsers } from '../../api/admin'
import UserCard from '../../components/admin/UserCard'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { debounce } from 'lodash'
import { Pagination } from '@mui/material'
import SEO from '../../Seo'

const AdminUserPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [apiSearch, setApiSearch] = useState('')

  const {
    data,
    isLoading: isUsersLoading,
    isError,
  } = useQuery({
    queryKey: ['AdminViewUsers', apiSearch, page],
    queryFn: () => adminViewUsers(apiSearch, page),
  })

  // Debounce function with a delay of 300 milliseconds for updating apiSearch state
  const debouncedApiSearch = debounce((value) => {
    setApiSearch(value)
  }, 700)

  if (isError) return <div>Error occurred</div>

  return (
    <section className="mx-1 md:mx-10 min-h-fit max-md:mb-40 relative">
      <SEO
        title={'Admin user view page'}
        description={'This is admin user view page'}
      />
      <div className="w-full relative px-3 flex justify-center min-h-fit h-full pb-10 gap-x-4 overflow-hidden">
        <div
          className={`sm:w-full ${
            true && 'sm:w-2/3'
          } w-full relative overflow-x-auto shadow-md sm:rounded-lg `}
        >
          <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-uAccent mb-5 gap-x-3 pl-5">
            Users{' '}
            <div className="flex gap-2 w-3/6 lg:w-2/6 ml-5">
              <input
                type="text"
                placeholder="search name/email/mobile"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  debouncedApiSearch(e.target.value)
                }}
                className={`!rounded-3xl border !border-uAccent/50 focus:outline-uAccent

                  } bg-white`}
              />
            </div>
          </div>

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100   dark:bg-gray-800"
                >
                  Profile
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100  dark:bg-gray-800 w-24  "
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100  dark:bg-gray-800"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center  font-extrabold text-medium bg-blue-100  dark:bg-gray-800"
                >
                  Mobile
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center font-extrabold text-medium bg-blue-100 dark:bg-gray-800"
                >
                  Block Status
                </th>
              </tr>
            </thead>
            <tbody className=" w-full">
              {isUsersLoading ? (
                <tr className="w-full text-center h-[130px] flex flex-col items-center justify-center text-xl font-medium  text-gray-700">
                  <td className="px-6 py-4 ">Loading...</td>
                </tr>
              ) : data.users.length > 0 ? (
                data.users.map((user) => (
                  <UserCard user={user} key={user._id} />
                ))
              ) : (
                <tr className="w-full h-[130px] flex flex-col items-center justify-center text-center mx-auto text-xl font-medium text-gray-700">
                  <td colSpan="5" className="px-6 py-4  w-full text-center ">
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex  justify-center absolute bottom-0">
        <Pagination
          count={data?.totalPages || 1}
          page={page}
          onChange={(event, value) => {
            setPage(value)
            window.scrollTo(0, 0)
          }}
        />
      </div>
    </section>
  )
}

export default AdminUserPage
