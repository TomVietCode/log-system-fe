"use client"

import { useEffect, useState } from "react"
import { devLogApi } from "@/lib/api/devlog-api"
import { Box, Button, CircularProgress, Paper } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { getColBackground, getDayOfWeek } from "@/lib/utils/date"
import dayjs from "dayjs"
import Toast from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export interface DevLog {
  days: number[]
  grandTotal: number
  month: string
  tasks: any[]
  totalByDay: number[]
  userName: string
  year: string
}

export default function DevLogsHistoryPage() {
  const [devLogs, setDevLogs] = useState<DevLog>()
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs())
  const rowCount = (devLogs && devLogs?.tasks.length + 3) || 2
  const colCount = selectedDate.daysInMonth() || 28
  const router = useRouter()
  const fetchDevLogs = async (month: number, year: number) => {
    try {
      setLoading(true)
      const response = await devLogApi.getDevLogs(month, year)
      setDevLogs(response.data)
    } catch (error: any) {
      Toast.error(error.response?.data?.message || "Không thể lấy dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load current month data by default
    const currentMonth = selectedDate.month() + 1 // dayjs months are 0-indexed
    const currentYear = selectedDate.year()
    fetchDevLogs(currentMonth, currentYear)
  }, [selectedDate])

  const handleSelectMonth = (date: dayjs.Dayjs) => {
    if (date) {
      setSelectedDate(date)
    }
    fetchDevLogs(date.month() + 1, date.year())
  }

  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      {/* Action section */}
      <Box className="flex gap-4">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Chọn tháng"
              views={["month", "year"]}
              onChange={(date) => date && handleSelectMonth(date)}
              value={selectedDate}
            />
          </DemoContainer>
        </LocalizationProvider>

        <div className="flex items-center justify-center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              router.push(`/devlogs`)
            }}
          >
            Sửa Devlog
          </Button>
        </div>
      </Box>
      {/* Data table */}
      <div className={`mt-5 h-[80%] grid grid-cols-[20%_120%_6%] overflow-x-auto relative`}>
        {loading ? (
          <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%" }} size={70} />
        ) : (
          <>
            {/* Name and Task Name Col*/}
            <div className={`grid grid-rows-${rowCount} sticky left-0 z-10`}>
              <div className="flex justify-center items-center text-red-600 font-semibold px-5 bg-blue-300 border border-black">
                {devLogs?.userName}
              </div>
              <div className="flex justify-center items-center px-5 bg-blue-200 border font-semibold">
                Tên Task
              </div>
              {devLogs?.tasks.map((task) => (
                <div
                  key={task.taskId}
                  className="flex flex-start items-center bg-gray-100 px-5 border"
                >
                  {task.taskName}
                </div>
              ))}
              <div className="flex justify-center items-center px-5 bg-gray-400 border font-semibold">
                Tổng
              </div>
            </div>

            {/* Data Cols */}
            <div className={`grid grid-cols-${colCount}`}>
              {devLogs &&
                [...Array(colCount)].map((_, index) => {
                  const day = devLogs.days[index]
                  const month = devLogs.month
                  const year = devLogs.year
                  const dayOfWeek = getDayOfWeek(day, Number(month), Number(year))
                  const colBackground = getColBackground(
                    day,
                    Number(month),
                    Number(year),
                    dayOfWeek
                  )

                  return (
                    <div key={index} className={`grid grid-rows-${rowCount} ${colBackground}`}>
                      <div className="flex justify-center items-center border font-semibold">
                        {day + "/" + month}
                      </div>
                      <div className="flex justify-center items-center border font-semibold">
                        {dayOfWeek}
                      </div>
                      {devLogs.tasks.map((task) => {
                        return (
                          <div
                            key={task.taskId}
                            className="flex justify-center items-center border"
                          >
                            {task.hoursByDay[index] > 0 ? task.hoursByDay[index] : "\u200B"}
                          </div>
                        )
                      })}
                      <div className="flex justify-center items-center border bg-gray-400">
                        {devLogs.totalByDay[index] === 0 ? "\u200B" : devLogs.totalByDay[index]}
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* Summary Col */}
            <div className={`grid grid-rows-${rowCount}  sticky right-0 z-10 bg-gray-400`}>
              <div className="flex justify-center items-center border font-semibold">Tổng</div>
              <div className="flex justify-center items-center border">&nbsp;</div>
              {devLogs &&
                devLogs?.tasks.map((task) => (
                  <div key={task.taskId} className="flex justify-center items-center border">
                    {task.totalHoursByTask > 0 ? task.totalHoursByTask : "\u200B"}
                  </div>
                ))}
              <div className="flex justify-center items-center border">{devLogs?.grandTotal}</div>
            </div>
          </>
        )}
      </div>
    </Paper>
  )
}
