"use client"

import { useNotification } from "@/context/notification.context"
import { useNotificationTranslations } from "@/lib/hook/useTranslations"
import { Notifications } from "@mui/icons-material"
import { Badge, Box, IconButton, ListItemText, ListItem, List, Popover, Typography } from "@mui/material"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NotificationBell() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { notifications, unreadCount, markAsRead } = useNotification()
  const t = useNotificationTranslations()

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotiClick = (id: string) => {
    markAsRead(id)
    router.push("/devlogs")
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} sx={{ mr: 2 }}>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ width: 320, maxWidth: "100%" }}>
          <List sx={{ maxHeight: 400, overflowY: "auto" }}>
            {notifications.length === 0 ?
              (
                <ListItem>
                  <ListItemText primary={t("noNotifications")} />
                </ListItem>
              ) : 
              notifications.map((noti) => {
                return (
                  <ListItem
                    key={noti.id}
                    sx={{ 
                      cursor: "pointer", 
                      "&:hover": { backgroundColor: "action.hover" },
                      backgroundColor: noti.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                      borderLeft: noti.isRead ? 'none' : '4px solid #1976d2'
                    }}
                    onClick={() => handleNotiClick(noti.id)}
                  >
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: noti.isRead ? 'normal' : 'bold',
                            color: noti.isRead ? 'text.primary' : 'primary.main'
                          }}
                        >
                          {noti.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <span 
                            style={{ 
                              color: noti.isRead ? 'text.secondary' : 'text.primary'
                            }}
                          >
                            {noti.content}
                          </span>
                          <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                            {dayjs(noti.createdAt).format("DD/MM/YYYY HH:mm")}
                          </Box>
                        </>
                      } 
                    />
                    {!noti.isRead && (
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main',
                          ml: 1
                        }} 
                      />
                    )}
                  </ListItem>
                )
              })}
          </List>
        </Box>
      </Popover>
    </>
  )
}
