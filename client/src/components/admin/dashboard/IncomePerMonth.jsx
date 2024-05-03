import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Chart from 'chart.js/auto'
import { CircularProgress } from '@mui/material'
import { delay } from '../../../api/general'

const fetchTotalIncomePerMonth = async () => {
  const { data } = await axios.get('/admin/dashboard/total-income') // Change the endpoint to the admin one
  await delay(500)
  return data.success ? data.totalIncome : []
}

const AdminIncomePerMonth = () => {
  // Rename the component to AdminIncomePerMonth
  const chartRef = useRef(null)

  const { data: incomeData, isLoading } = useQuery({
    queryKey: ['adminIncomePerMonth'], // Change the query key to adminIncomePerMonth
    queryFn: fetchTotalIncomePerMonth,
  })

  useEffect(() => {
    if (incomeData && incomeData.length > 0) {
      let myChart
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d')
        if (myChart) {
          myChart.destroy()
        }
        myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
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
            ],
            datasets: [
              {
                label: 'Total Income per Month',
                data: incomeData,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
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
  }, [chartRef, incomeData])

  const currentMonth = new Date().getMonth()
  const currentMonthIncome = incomeData ? incomeData[currentMonth] : 0

  if (isLoading) {
    return (
      <div className="w-full min-h-44 flex flex-center">
        <CircularProgress />
      </div>
    )
  }

  if (!incomeData || incomeData.length === 0) {
    return (
      <div className="flex flex-center w-full min-h-32 self-stretch">
        No income data available
      </div>
    )
  }

  return (
    <div>
      <h2>This Month: {currentMonthIncome.toLocaleString()} /-</h2>

      <canvas ref={chartRef} className="w-full" />
    </div>
  )
}

export default AdminIncomePerMonth
