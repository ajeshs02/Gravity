import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { adminLogoutApi } from '../../api/auth'
import { useDispatch } from 'react-redux'
import { adminLogout } from '../../state/slices/adminSlice'
import { useRef } from 'react'
import { FaFileDownload } from 'react-icons/fa'
import axios from 'axios'

const AdminNavbar = ({ navbarLinks }) => {
  const location = useLocation()
  const page = location.pathname
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isSelected = (name, link) => {
    if (name === 'Home') {
      return page === '/admin'
    } else {
      return page === link
    }
  }

  const fetchAndDownloadReport = async () => {
    const response = await axios.get('/admin/stores/income/store/month/pdf')
    const transactions = response.data

    const doc = new jsPDF()

    // Get the current month
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const currentDate = new Date()
    const currentMonth = monthNames[currentDate.getMonth()]

    doc.setFontSize(18)
    doc.text(`Store Income Report - ${currentMonth}`, 15, 15)

    // Add a "margin bottom" by increasing the y coordinate
    let marginBottom = 5 // Adjust this value to increase or decrease the margin

    const columns = ['Store ID', 'Total Income']

    const data = transactions.map((transaction) => [
      transaction._id.toString(), // Convert storeId to string
      transaction.totalIncome,
    ])

    // Start the table below the heading + margin
    doc.autoTable({
      columns: columns.map((column) => ({ header: column, dataKey: column })),
      body: data,
      startY: 15 + marginBottom, // Add the margin to the y coordinate
    })

    // Save the PDF with the current month in the filename
    doc.save(`${currentMonth}-Income-Report.pdf`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-auto flex justify-between items-center py-2 wrapper bg-primary z-10">
      {/* left */}
      <div className="flex-center gap-2">
        <p className="text-lg tracking-widest max-sm:hidden">GravShop</p>
        <img
          src="/gravshop.webp"
          alt="logo"
          loading="lazy"
          width={45}
          height={45}
          style={{ filter: 'invert(100%)' }}
        />
      </div>

      {/* right */}
      <nav className=" ml-4">
        <div className="flex gap-x-2">
          <ul className="flex gap-x-4">
            {navbarLinks.map((item) => (
              <li
                key={item.link}
                className={`hover:text-uAccent ${
                  isSelected(item.text, item.link) && 'text-uAccent'
                } `}
              >
                <Link to={item.link}>{item.text}</Link>
              </li>
            ))}

            <li>
              <button
                onClick={fetchAndDownloadReport}
                className="flex gap-x-1 flex-center hover:text-uAccent"
              >
                Report <FaFileDownload />
              </button>
            </li>

            <li>
              <button
                className={`${'hover:text-uAccent'} `}
                onClick={async () => {
                  try {
                    await adminLogoutApi()
                    dispatch(adminLogout())
                    navigate('/login')
                  } catch (error) {
                    console.error('Logout failed:', error)
                    alert('Logout failed')
                  }
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
export default AdminNavbar
