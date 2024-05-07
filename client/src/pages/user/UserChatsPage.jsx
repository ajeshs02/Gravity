import React, { useEffect } from 'react'
import UserChatsList from '../../components/user/UserChatsList'

const UserChatsPage = () => {
  useEffect(() => {
    const setWindowHeight = () => {
      const windowHeight = window.innerHeight
      const secondDivElement = document.getElementById('secondDiv')

      // Set the height of the second div to match the window height
      secondDivElement.style.height = `${windowHeight - 80}px`
    }

    // Call the function when the page loads or when the window is resized
    window.addEventListener('load', setWindowHeight)
    window.addEventListener('resize', setWindowHeight)

    return () => {
      window.removeEventListener('load', setWindowHeight)
      window.removeEventListener('resize', setWindowHeight)
    }
  }, [])

  return (
    <div className="flex">
      <UserChatsList />
      <div
        id="secondDiv"
        className="w-full flex flex-center max-md:hidden"
        style={{
          height: window.innerHeight - 80 + 'px',
          backgroundImage: `url(/doodle.webp)`,
          opacity: 0.8,
        }}
      >
        <p className="text-xl">select a store to chat</p>
      </div>
    </div>
  )
}

export default UserChatsPage
