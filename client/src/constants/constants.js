import { FaUserAlt, FaUserCheck } from 'react-icons/fa'
import { FaShoppingCart } from 'react-icons/fa'
import { FaClipboardList } from 'react-icons/fa'
import { IoLogIn } from 'react-icons/io5'
import { FaStore } from 'react-icons/fa'
import { GoHomeFill } from 'react-icons/go'
import { LuPackage } from 'react-icons/lu'
import { BiSolidMessageSquareDetail } from 'react-icons/bi'
// user navbar links
export const userNavbarLinks = [
  {
    link: '/',
    text: 'Home',
  },
  {
    link: '/cart',
    text: 'Cart',
  },
  {
    link: '/orders',
    text: 'Orders',
  },
  {
    link: '/profile',
    text: 'Profile',
  },
  {
    link: '/chats',
    text: 'Chats',
  },
]

// //user sidebar link
export const userSidebarLinks = [
  {
    icon: GoHomeFill,
    link: '/',
    text: 'Home',
  },
  {
    icon: FaShoppingCart,
    link: '/cart',
    text: 'Cart',
  },
  {
    icon: LuPackage,
    link: '/orders',
    text: 'Orders',
  },
  {
    icon: FaUserAlt,
    link: '/profile',
    text: 'Profile',
  },
  {
    icon: BiSolidMessageSquareDetail,
    link: '/chats',
    text: 'Messages',
  },
]

// store navbar links
export const storeNavbarLinks = [
  {
    link: '/store',
    text: 'Home',
  },
  {
    link: '/store/products',
    text: 'Products',
  },
  {
    link: '/store/orders',
    text: 'Orders',
  },
  {
    link: '/store/profile',
    text: 'Profile',
  },
  {
    link: '/store/chats',
    text: 'Messages',
  },
]

// //store sidebar link
export const storeSidebarLinks = [
  {
    icon: GoHomeFill,
    link: '/store',
    text: 'Home',
  },
  {
    icon: FaShoppingCart,
    link: '/store/products',
    text: 'Products',
  },
  {
    icon: FaClipboardList,
    link: '/store/orders',
    text: 'Orders',
  },
  {
    icon: FaStore,
    link: '/store/profile',
    text: 'Profile',
  },
  {
    icon: BiSolidMessageSquareDetail,
    link: '/store/chats',
    text: 'Messages',
  },
]

// admin navbar links
export const adminNavbarLinks = [
  {
    link: '/admin',
    text: 'Home',
  },
  {
    link: '/admin/stores',
    text: 'Stores',
  },
  {
    link: '/admin/users',
    text: 'Users',
  },
  {
    link: '/admin/orders',
    text: 'Orders',
  },
]
