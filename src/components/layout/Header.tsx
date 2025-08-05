'use client'

import { getMenuByRole } from "@/config/menu"
import { User } from "@/interface/auth"
import { AppBar, Box, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { KeyboardArrowUpOutlined, KeyboardArrowDownOutlined } from '@mui/icons-material'
import Link from "next/link"
import NotificationBell from "../ui/NotificationBell"
import { useCommonTranslations } from "@/lib/hook/useTranslations"
import LanguageSwitcher from "../ui/LanguageSwitcher"

export default function Header({ user, logout }: { user: User | null, logout: () => void }) {
  const menuItems = user && getMenuByRole(user.role)
  const labelNames = menuItems?.map((item) => item.label)
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const t = useCommonTranslations()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
  }

  //Get current page title
  const currentMenuItem = menuItems?.find((item) => pathname.includes(item.path))
  const pageTitle = currentMenuItem ? t(currentMenuItem.label) : null
  
  return (
    <AppBar position="fixed" elevation={1} sx={{ minHeight: "50px" }}>
      <Toolbar sx={{ px: 2, ml: { sm: "250px" }, minHeight: "50px" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>

        {/* Language switcher */}
        <Box sx={{ mr: 2 }}>
          <LanguageSwitcher />
        </Box>

        {/* User menu */}
        {user && (  
          <>
            <NotificationBell />

            <Typography 
              variant="body2" 
              className="px-2 py-1"
              sx={{ 
                cursor: "pointer", 
                display: "flex",
                alignItems: "center",
                gap: 1,
                '&:hover': { backgroundColor: "rgba(0, 0, 0, 0.08)"  } 
              }} 
              onClick={handleMenuOpen}
            >
              {user.fullName}
              {open ? <KeyboardArrowDownOutlined /> : <KeyboardArrowUpOutlined />}
            </Typography>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem>
                <Link href="/profile" onClick={() => handleMenuClose()}>
                  <Typography variant="body2" sx={{ cursor: "pointer" }}>
                    Thông tin tài khoản 
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link href="/login" onClick={() => handleLogout()}>
                  <Typography variant="body2" sx={{ cursor: "pointer" }} >
                    Đăng xuất
                  </Typography>
                </Link>

              </MenuItem>
            </Menu>
          </>

        )}
      </Toolbar>
    </AppBar>
  )
}