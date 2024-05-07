import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { userFetchChats } from '../../api/user'

const UserChatsList = () => {
  const navigate = useNavigate()

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ['private_chats'],
    queryFn: userFetchChats,
  })

  const handleClick = (conversationId) => {
    navigate(`/message/${conversationId}`)
  }

  // useEffect(() => {
  //   console.log(chats)
  // }, [isLoading])

  return (
    <div className="flex flex-col gap-y-1 w-full border-r border-slate-400 overflow-y-auto p-1">
      {isLoading ? (
        'Loading,..'
      ) : chats.length > 0 ? (
        chats.map((chat) => {
          const store = chat.members.find(
            (member) => member.model === 'Store'
          ).id
          return (
            <div
              className={`w-full flex items-center gap-x-2 bg-uAccent/30 p-2 rounded-xl px-3 hover:bg-uAccent/70 font-medium hover:text-white transition-all cursor-pointer`}
              key={chat._id}
              onClick={() => handleClick(chat.conversationId)}
            >
              <div className="w-12 h-12 aspect-square rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={store.image.url}
                  alt={store.storeName}
                />
              </div>
              <p className="text-base">{store.storeName}</p>
            </div>
          )
        })
      ) : (
        <div>No chats yet</div>
      )}
    </div>
  )
}

export default UserChatsList
