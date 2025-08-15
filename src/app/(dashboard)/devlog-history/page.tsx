"use client"

import { useEffect, useState } from "react"
import { devLogApi } from "@/lib/api/devlog-api"
import { Autocomplete, Box, Button, CircularProgress, Paper, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { getColBackground, getDayOfWeek } from "@/lib/utils/date"
import dayjs from "dayjs"
import Toast from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth.context"
import { userApi } from "@/lib/api/user-api"
import { useCurrentLocale, useDevlogTranslations } from "@/lib/hook/useTranslations"

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
  const t = useDevlogTranslations()
  const locale = useCurrentLocale()
  const { user } = useAuth()
  const [devLogs, setDevLogs] = useState<DevLog | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs())
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const rowCount = (devLogs && devLogs?.tasks.length + 3) || 2
  const colCount = dayjs(selectedDate).daysInMonth()
  const router = useRouter()  

  const canViewOtherUsersLogs =
    user?.role === "ADMIN" || user?.role === "LEADER" || user?.role === "HCNS"

  // Get users list
  useEffect(() => {
    if (canViewOtherUsersLogs) {
      const fetchUsers = async () => {
        try {
          const response = await userApi.getListDev()
          setUsers(response.data)
        } catch (error: any) {
          Toast.error(error.response?.data?.message || t("history.messages.error"))
        }
      }
      fetchUsers()
    }
  }, [canViewOtherUsersLogs])
  console.log(colCount)
  const fetchDevLogs = async (month: number, year: number) => {
    try {
      setLoading(true)
      const targetUserId = selectedUser?.id || user?.id
      if (!targetUserId) {
        setDevLogs(null)
        setLoading(false)
        return
      }
      const response = await devLogApi.getDevLogs(targetUserId, month, year)
      setDevLogs(response.data)
    } catch (error: any) {
      setDevLogs(null)
      if(user?.role !== "HCNS" || selectedUser) {
        Toast.info(t("history.messages.noProject"))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load current month data by default
    // For HCNS: only fetch when a user is selected
    // For other roles: fetch immediately
    const currentMonth = selectedDate.month() + 1
    const currentYear = selectedDate.year()
    
    if (user?.role === "HCNS" && !selectedUser) {
      // HCNS hasn't selected a user yet, don't fetch data
      return
    }
    
    fetchDevLogs(currentMonth, currentYear)
  }, [selectedDate, selectedUser, user?.role])

  const handleSelectMonth = (date: dayjs.Dayjs) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleUserChange = (newValue: any) => {
    setSelectedUser(newValue)
  }
  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      {/* Action section */}
      <Box className="flex gap-4">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label={t("history.filters.month")}
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
            {t("history.actions.update")}
          </Button>
        </div>

        {canViewOtherUsersLogs && (
          <Autocomplete
            options={users}
            getOptionLabel={(option) => `${option.fullName} - ${option.employeeCode}`}
            sx={{ width: 270, alignSelf: "flex-end", marginLeft: "auto" }}
            renderInput={(params) => (
              <TextField {...params} label={t("history.filters.selectDev")} />
            )}
            onChange={(_event, newValue) => handleUserChange(newValue)}
            value={selectedUser}
          />
        )}
      </Box>
      {/* Data table */}
      {loading ? (
        <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%" }} size={70} />
      ) : (!devLogs ? (
          <div className="flex justify-center items-center h-[80%]">
            <div className="text-2xl">
              {user?.role === "HCNS" && !selectedUser 
                ? t("history.messages.selectUserFirst", { defaultValue: "Vui lòng chọn người dùng để xem lịch sử devlog" })
                : t("history.messages.noData")
              }
            </div>
          </div>
        ) : (
          <>
          {/* Name and Task Name Col*/}
            <div className={`mt-5 h-[80%] grid grid-cols-[20%_120%_6%] overflow-x-auto relative`}>
              <div className={`grid grid-rows-${rowCount} sticky left-0 z-10`}>
                <div className="flex justify-center items-center text-red-600 font-semibold px-5 bg-blue-300 border border-black">
                  {devLogs?.userName}
                </div>
                <div className="flex justify-center items-center px-5 bg-blue-200 border font-semibold">
                  {t("history.table.taskName")}
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
                  {t("history.table.total")}
                </div>
              </div>

              {/* Data Cols */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                }}
              >
                {devLogs &&
                  [...Array(colCount)].map((_, index) => {
                    const day = devLogs.days[index]
                    const month = devLogs.month
                    const year = devLogs.year
                    const dayOfWeek = getDayOfWeek(day, Number(month), Number(year), locale)
                    const colBackground = getColBackground(
                      day,
                      Number(month),
                      Number(year),
                      dayOfWeek,
                      locale
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
                <div className="flex justify-center items-center border font-semibold">
                  {t("history.table.total")}
                </div>
                <div className="flex justify-center items-center border">&nbsp;</div>
                {devLogs &&
                  devLogs?.tasks.map((task) => (
                    <div key={task.taskId} className="flex justify-center items-center border">
                      {task.totalHoursByTask > 0 ? task.totalHoursByTask : "\u200B"}
                    </div>
                  ))}
                <div className="flex justify-center items-center border">{devLogs?.grandTotal}</div>
              </div>
            </div>
          </>
        )
      )}
    </Paper>
  )
}
