import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { CircularProgress } from '@mui/material'
import Chart from 'chart.js/auto'

const TotalFollowers = () => {
  const [totalFollowers, setTotalFollowers] = useState(0)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const chartRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get('/store/dashboard/followers')
        if (response.data.success) {
          setData(response.data.followersOverTime)
          setTotalFollowers(response.data.totalFollowersCount)
          setIsLoading(false)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map((item) => new Date(item._id).toLocaleDateString()),
          datasets: [
            {
              label: 'Followers Over Time',
              data: data.map((item) => item.count),
              fill: false,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        },
      })
    }
  }, [chartRef, data])

  if (isLoading) {
    return (
      <div className="w-full min-h-44 flex flex-center">
        <CircularProgress />
      </div>
    )
  }
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">
        Total Followers: {totalFollowers}
      </h2>
      <canvas ref={chartRef} />
    </section>
  )
}

export default TotalFollowers
