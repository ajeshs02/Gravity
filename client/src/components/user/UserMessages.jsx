import { useSelector } from 'react-redux'

const UserMessages = ({ messages = [] }) => {
  const userId = useSelector((state) => state.user.id)

  return (
    <div className="h-[66%] px-2 flex flex-col gap-y-[2px]  overflow-y-auto mr-2">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message._id}
            className={`${
              message.sender.id === userId
                ? 'bg-uAccent self-end rounded-tr-none rounded-br-md'
                : 'bg-sAccent  rounded-tl-none rounded-bl-md'
            } w-3/4 py-1 pl-2 rounded-xl text-white`}
          >
            <p>{message.content}</p>
          </div>
        ))
      ) : (
        <div className="w-full h-72 text-lg flex justify-center items-center gap-y-4 font-medium ">
          No Messages Yet
        </div>
      )}
    </div>
  )
}
export default UserMessages
