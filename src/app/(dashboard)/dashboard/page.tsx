"use client"

import { useEffect, useState } from "react"
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import dayjs from "dayjs"
import Toast from "@/components/ui/alert"
import { dashboardApi } from "@/lib/api/dashboard-api"

interface StatisticDto {
  year: number
  month: number
  daysInMonth: number[]
  hours: number[]
}
export default function DashboardPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<StatisticDto>()
  console.log(data)
  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await dashboardApi.getDashboardData() 
      setData(result.data as StatisticDto)
      setLoading(false)
    } catch (error) {
      Toast.error("Không thể lấy dữ liệu")
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: `DevLogs`,
      style: {
        fontSize: "1.3rem",
        fontWeight: "400",
      },
    },
    xAxis: {
      categories: data?.daysInMonth.map(
        (day) => `${data.month > 9 ? data.month : `0${data.month}`}-${day > 9 ? day : `0${day}`}`
      ),
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Thời gian làm (h)",
      },
    },
    tooltip: {
      valueSuffix: "h",
    },
    plotOptions: {},
    series: [
      {
        name: "Effective",
        data: data?.hours || [],
        type: "column",
        color: "#8FB3EE",
      },
    ],
    credits: {
      enabled: false,
    },
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tổng quan {data?.year}-{data?.month}
      </Typography>
      
      <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
