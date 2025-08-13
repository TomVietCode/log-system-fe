"use client"

import { useEffect, useState } from "react"
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import Toast from "@/components/ui/alert"
import { dashboardApi } from "@/lib/api/dashboard-api"
import { useDashboardTranslations } from "@/lib/hook/useTranslations"

interface StatisticDto {
  year: number
  month: number
  daysInMonth: number[]
  hours: number[]
}
export default function DashboardPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<StatisticDto>({
    year: 0,
    month: 0,
    daysInMonth: [],
    hours: []
  })

  const t = useDashboardTranslations()
  const fetchData = async () => {
    try {
      const result = await dashboardApi.getDashboardData() 
      setData(result.data as StatisticDto)
    } catch (error: any) {
      if (error.response?.data?.message === "User is not a member of any project"){
        Toast.info(t("errors.noProject"))
      } else {
        Toast.error(error.response?.data?.message || t("errors.chart"))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("hello")
    fetchData()
  }, [])
  
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: t('charts.title'),
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
        text: t('charts.hoursPerDay'),
      },
    },
    tooltip: {
      valueSuffix: "h",
    },
    plotOptions: {},
    series: [
      {
        name: t("charts.effective"),
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
        {t("title")} {data?.month}-{data?.year}
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
