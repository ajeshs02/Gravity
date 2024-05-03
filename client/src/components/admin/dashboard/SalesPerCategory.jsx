import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Chart from 'chart.js/auto'
import { CircularProgress } from '@mui/material'
import { delay } from '../../../api/general'

const fetchSalesPerCategory = async () => {
  const { data } = await axios.get('/admin/dashboard/sales-per-category') // Change the endpoint to the admin one
  await delay(200)
  return data.success ? data.salesPerCategory : []
}

const AdminSalesPerCategory = () => {
  // Rename the component to AdminSalesPerCategory
  const chartRef = useRef(null)

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['adminSalesPerCategory'], // Change the query key to adminSalesPerCategory
    queryFn: fetchSalesPerCategory,
  })

  useEffect(() => {
    if (salesData && salesData.length > 0) {
      let myChart
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d')
        if (myChart) {
          myChart.destroy()
        }
        myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: salesData.map((data) => data._id),
            datasets: [
              {
                label: 'Sales per Category',
                data: salesData.map((data) => data.totalSales),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
          },
        })
      }
      return () => {
        if (myChart) {
          myChart.destroy()
        }
      }
    }
  }, [chartRef, salesData])

  if (isLoading) {
    return (
      <div className="w-full min-h-44 flex flex-center">
        <CircularProgress />
      </div>
    )
  }

  if (!salesData || salesData.length === 0) {
    return (
      <div
        className="flex flex-center w-full min-h-32
       self-stretch "
      >
        No sales data available
      </div>
    )
  }

  return (
    <canvas
      ref={chartRef}
      className="w-full bg-secondary rounded-xl max-h-72"
    />
  )
}

export default AdminSalesPerCategory
