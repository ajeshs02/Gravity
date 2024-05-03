import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userBlockToggle } from '../../api/admin'

const UserCard = ({ user }) => {
  const { _id, name, email, mobile, image, isBlocked } = user

  const queryClient = useQueryClient()

  const { mutateAsync: updateUserBlockStatus, isPending: isUpdating } =
    useMutation({
      mutationFn: userBlockToggle,
      onSuccess: () => {
        queryClient.invalidateQueries(['AdminViewUsers'], { exact: true })
      },
    })

  const updateUser = async () => {
    try {
      await updateUserBlockStatus(_id)
    } catch (error) {
      alert('failed updating user status')
      console.error(error)
    }
  }

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="px-6 py-4 bg-gray-50  ">
        <div className="min-h-14 mx-auto w-20 max-h-20 flex bg-white justify-center  rounded-md h-full p-2">
          <img
            src={image.url}
            alt="User profile image"
            className="object-contain max-h-full max-w-full"
          />
        </div>
      </td>
      <th
        scope="row"
        className="px-6 py-4 text-center  text-gray-900 whitespace-nowrap font-semibold "
      >
        {name}
      </th>
      <td className="px-6 py-4 text-center  bg-gray-50">{email}</td>
      <td className="px-6 py-4 text-center ">{mobile}</td>
      <td className="px-6 py-4 text-center  bg-gray-50">
        <button
          className={`px-2 w-20 py-1 rounded-xl text-white ${
            isBlocked ? 'bg-red-600' : 'bg-uAccent'
          } text-center font-bold active:scale-[0.99] hover:scale-[1.01]`}
          onClick={updateUser}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <img
              src="/loading.svg"
              alt="loading..."
              width={20}
              height={20}
              className="mx-auto text-white"
            />
          ) : isBlocked ? (
            'Blocked'
          ) : (
            'Active'
          )}
        </button>
      </td>
    </tr>
  )
}
export default UserCard
