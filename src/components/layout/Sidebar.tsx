"use client"

import { MenuItem } from "@/config/menu"
import { ChevronLeft } from "@mui/icons-material"
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const SIDEBAR_WIDTH = 250

export default function Sidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          borderRight: "none",
          backgroundColor: "background.paper",
          pt: 15,
          transition: "width 0.2s",
          overflowX: "hidden",
        },
      }}
    >
      {/* Menu items */}
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => {
          if (item.status === "hidden") return null;
          
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path) && item.path !== "/";

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                  "&:hover": {
                    backgroundColor: "background.default",
                    color: "primary.dark",
                  },
                  ...(isActive && {
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "#ffffff" : "text.primary",
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: isActive ? "#ffffff" : "text.primary",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  )
}