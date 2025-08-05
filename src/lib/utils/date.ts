import dayjs from "dayjs"

const dayNames = {
  vi: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
}

export type Language = keyof typeof dayNames
const locale = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('locale'))?.split('locale=')[1] : 'en'

export const getDayOfWeek = (
  day: number, 
  month: number, 
  year: number, 
) => {
  const date = dayjs(`${year}-${month}-${day}`)
  const dayOfWeek = date.day()
  return dayNames[locale as Language][dayOfWeek]
}

const isToday = (day: number, month: number, year: number) => {
  const today = dayjs()
  return today.date() === day && 
         today.month() + 1 === month && 
         today.year() === year
}

export const isWeekend = (dayOfWeek: string) => {
  if (locale === "vi") {
    return dayOfWeek === "T7" || dayOfWeek === "CN"
  } else {
    return dayOfWeek === "Sat" || dayOfWeek === "Sun"
  }
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