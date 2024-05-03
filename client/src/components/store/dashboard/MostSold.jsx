import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Chart from 'chart.js/auto'
import { CircularProgress } from '@mui/material'
import { delay } from '../../../api/general'

const fetchMostSoldProduct = async () => {
  const { data } = await axios.get('/store/dashboard/mostSold')
  await delay(400)
  return data.success ? data.mostSoldProducts : []
}

const MostSoldProduct = () => {
  const chartRef = useRef(null)

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['storeMostSoldProduct'],
    queryFn: fetchMostSoldProduct,
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
                label: 'Most Sold Products',
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

export default MostSoldProduct
