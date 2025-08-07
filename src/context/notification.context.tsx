"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth.context"
import { notificationApi } from "@/lib/api/noti-api"
import Toast from "@/components/ui/alert"
import { useNotificationTranslations } from "@/lib/hook/useTranslations"

interface AppNotification {
  id: string
  title: string
  content: string
  isRead: boolean
  createdAt: string
}

interface NotificationContextType {
  notifications: AppNotification[]
  unreadCount: number
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  sendReminder: (userId: string, projectId: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const { user } = useAuth()
  const t = useNotificationTranslations()

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications()
      setNotifications(response)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      Toast.error(t('messages.fetchError'))
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications((prev) => prev.map((notification) => 
        notification.id === id ? { ...notification, isRead: true } : notification
      ))

    } catch (error) {
      console.error('Error marking notification as read:', error)
      Toast.error(t('messages.markReadError'))
    }
  }
  
  const sendReminder = async (userId: string, projectId: string) => {
    try {
      await notificationApi.sendReminder(userId, projectId)
      Toast.success(t('messages.reminderSent'))   
    } catch (error: any) {
      Toast.error(error.response?.data?.message || t('messages.reminderError'))
    }
  }

  useEffect(() => {
    if(user) {
      fetchNotifications()
    }
  }, [user])

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, fetchNotifications, markAsRead, sendReminder }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}