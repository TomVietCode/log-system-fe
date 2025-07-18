import dayjs from "dayjs"

const vietnameseDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

export const getDayOfWeek = (day: number, month: number, year: number) => {
  const date = dayjs(`${year}-${month}-${day}`)
  const dayOfWeek = date.day()
  return vietnameseDays[dayOfWeek]
}

const isToday = (day: number, month: number, year: number) => {
  const today = dayjs()
  return today.date() === day && 
         today.month() + 1 === month && 
         today.year() === year
}

export const isWeekend = (dayOfWeek: string) => {
  return dayOfWeek === "T7" || dayOfWeek === "CN"
}

export const getColBackground = (day: number, month: number, year: number, dayOfWeek: string) => {
  if (isToday(day, month, year)) return "bg-blue-300"
  if (isWeekend(dayOfWeek)) return "bg-gray-200"
  return ""
}

export const getCurrentDate = () => {
  const today = dayjs()
  return today.format("MM/YYYY")
}