import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Chart from 'chart.js/auto'
import { CircularProgress } from '@mui/material'
import { delay } from '../../../api/general'

const fetchMostBoughtProducts = async () => {
  // Rename the function to fetchMostBoughtProducts
  const { data } = await axios.get('/admin/dashboard/most-bought') // Change the endpoint to the admin one
  await delay(400)
  return data.success ? data.mostBoughtProducts : [] // Change the data field to mostBoughtProducts
}

const AdminMostBoughtProducts = () => {
  // Rename the component to AdminMostBoughtProducts
  const chartRef = useRef(null)

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['adminMostBoughtProducts'], // Change the query key to adminMostBoughtProducts
    queryFn: fetchMostBoughtProducts,
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
          type: 'bar',
          data: {
            labels: salesData.map((data) => data.product.name),
            datasets: [
              {
                label: 'Most Bought Products', // Change the label to Most Bought Products
                data: salesData.map((data) => data.quantity),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
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
      <div className="flex flex-center w-full min-h-32 self-stretch">
        No sales data available
      </div>
    )
  }

  return <canvas ref={chartRef} className="w-full bg-secondary rounded-xl" />
}

export default AdminMostBoughtProducts
