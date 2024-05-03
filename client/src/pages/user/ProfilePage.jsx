import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MdEmail } from 'react-icons/md'
import { FaEdit, FaPhoneAlt } from 'react-icons/fa'

import { CircularProgress } from '@mui/material'
import Address from '../../components/user/Address'
import {
  getUserProfile,
  userProfileImageChange,
  userProfileUpdate,
} from '../../api/user'
import SEO from '../../Seo'

const ProfilePage = () => {
  const [isNameSelected, setIsNameSelected] = useState(false)
  const [isMobileSelected, setIsMobileSelected] = useState(false)
  const [name, setName] = useState('')
  const [newName, setNewName] = useState('')
  const [mobile, setMobile] = useState('')
  const [newMobile, setNewMobile] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    queryKey: ['user_profile'],
    queryFn: getUserProfile,
  })

  useEffect(() => {
    if (!isProfileLoading) {
      setName(user.name)
      setNewName(user.name)
      setMobile(user.mobile)
      setNewMobile(user.mobile)
    }
  }, [isProfileLoading])

  const { mutateAsync: updateUserProfile, isPending } = useMutation({
    mutationFn: (data) => userProfileImageChange(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user_profile'], { exact: true })
    },
  })
  const { mutateAsync: updateProfile, isPending: isProfilePending } =
    useMutation({
      mutationFn: (data) => userProfileUpdate(data),
      onSuccess: (data) => {
        queryClient.invalidateQueries(['user_profile'], { exact: true })
        setNewName(data.user.name)
        setNewMobile(data.user.mobile)
      },
    })

  const handleImageChange = async (event) => {
    if (event.target.files.length > 0) {
      const selectedImage = event.target.files[0]

      const formData = new FormData()
      formData.append('image', selectedImage)

      await updateUserProfile(formData)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    await updateProfile({ name: newName, mobile: newMobile })
    setIsNameSelected(false)
    setIsMobileSelected(false)
    setIsEditing(false)
  }

  return (
    <section className="mb-12  py-16  mx-auto flex flex-col gap-y-12 lg:flex-row bg-secondary p-3 rounded-md">
      {/* profile section */}
      {isProfileLoading ? (
        <>
          <SEO
            title={`Profile Page`}
            description={'This is user Profile page'}
          />
          <div className="w-full h-72 flex justify-center items-center gap-y-4 font-medium ">
            <CircularProgress style={{ scale: '1.5' }} />
          </div>
        </>
      ) : (
        <div className="flex max-sm:flex-col justify-center items-center mx-auto gap-x-3 lg:gap-x-9 lg:max-w-[80%]">
          <SEO
            title={`${user.name} - profile Page`}
            description={'This is user cart page'}
          />
          {/* image */}
          <div className="w-32 h-32 ml-auto max-sm:mx-auto  lg:w-44 lg:h-44 flex justify-end items-start  relative bg-primary aspect-square rounded-full ">
            <figure className=" ml-auto w-full h-full flex justify-end items-start  relative bg-primary aspect-square rounded-full overflow-hidden flex-center">
              {isPending ? (
                <CircularProgress />
              ) : (
                <img
                  src={user.image?.url}
                  alt={user.name}
                  loading="lazy"
                  className="w-full h-full object-cover  object-center  "
                />
              )}
            </figure>

            {/* upload image */}
            <label
              className={`absolute right-0 bottom-0 h-8 w-8 aspect-square flex flex-col  items-center justify-center border bg-uAccent border-white rounded-full  text-2xl text-white mb-2 hover:cursor-pointer`}
            >
              <input
                type="file"
                className="hidden"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              <FaEdit className="scale-90" />
            </label>
          </div>
          {/*right*/}
          <div className="w-full sm:w-3/5 flex flex-col gap-y-2 pl-3 ">
            <div className="flex justify-start gap-x-5">
              <form onSubmit={handleProfileUpdate}>
                <div
                  className={`flex ${
                    isNameSelected && 'flex-col'
                  } items-center  gap-x-1`}
                >
                  <input
                    type="text"
                    placeholder="Enter name"
                    id="name"
                    value={newName}
                    className={`focus:outline-uAccent  border-none !text-lg w-2/4 capitalize`}
                    disabled={!isNameSelected}
                    ref={(input) => input && isNameSelected && input.focus()}
                    onChange={(e) => setNewName(e.target.value)}
                  />

                  <div className="flex gap-x-4">
                    {isNameSelected ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsNameSelected(false)
                          setNewName(name)
                        }}
                        className="text-red-500"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        aria-label="update"
                        onClick={(event) => {
                          event.preventDefault()
                          setIsNameSelected(true)
                        }}
                        type="button"
                      >
                        {isProfilePending ? (
                          'Updating...'
                        ) : (
                          <FaEdit className="hover:text-uAccent" />
                        )}
                      </button>
                    )}
                    {isNameSelected && newName !== name && (
                      <button type="submit" className="text-uAccent">
                        Update
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={`flex ${
                    isMobileSelected && 'flex-col'
                  } items-center  gap-x-1`}
                >
                  <input
                    type="text"
                    placeholder="Enter mobile"
                    id="name"
                    value={newMobile}
                    className={`focus:outline-uAccent  border-none  w-2/4 `}
                    disabled={!isMobileSelected}
                    ref={(input) => input && isMobileSelected && input.focus()}
                    onChange={(e) => setNewMobile(e.target.value)}
                  />
                  <div className="flex gap-x-4">
                    {isMobileSelected ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileSelected(false)
                          setNewMobile(mobile)
                        }}
                        className="text-red-500"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        aria-label="update"
                        onClick={(event) => {
                          event.preventDefault()
                          setIsMobileSelected(true)
                        }}
                        type="button"
                      >
                        {isProfilePending ? (
                          'Updating...'
                        ) : (
                          <FaEdit className="hover:text-uAccent" />
                        )}
                      </button>
                    )}
                    {isMobileSelected && newMobile !== mobile && (
                      <button type="submit" className="text-uAccent">
                        Update
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <p className="flex items-center max-sm:text-sm mb-2 gap-x-1">
              <span>
                <MdEmail />{' '}
              </span>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </p>
          </div>
        </div>
      )}

      {/*address section  */}
      <Address />
    </section>
  )
}
export default ProfilePage
