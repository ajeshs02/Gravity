import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { storeFetchChats } from '../../api/store'

const StoreChatsList = () => {
  const navigate = useNavigate()

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ['private_chats'],
    queryFn: storeFetchChats,
  })

  const handleClick = (conversationId) => {
    navigate(`/store/message/${conversationId}`)
  }

  return (
    <div className="flex flex-col gap-y-1 w-full border-r border-slate-400 overflow-y-auto p-1">
      {isLoading ? (
        'Loading,..'
      ) : chats.length > 0 ? (
        chats.map((chat) => {
          const user = chat.members.find((member) => member.model === 'User').id
          return (
            <div
              className={`w-full flex items-center gap-x-2 bg-uAccent/30 p-2 rounded-xl px-3 hover:bg-uAccent/70 font-medium hover:text-white transition-all cursor-pointer`}
              key={chat._id}
              onClick={() => handleClick(chat.conversationId)}
            >
              <div className="w-12 h-12 aspect-square rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={user.image.url}
                  alt={user.storeName}
                />
              </div>
              <p className="text-base">{user.name}</p>
            </div>
          )
        })
      ) : (
        <div>No chats yet</div>
      )}
    </div>
  )
}

export default StoreChatsList
