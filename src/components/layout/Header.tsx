'use client'

import { getMenuByRole } from "@/config/menu"
import { User } from "@/interface/auth"
import { AppBar, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
import { usePathname } from "next/navigation"
import router from "next/router"
import { useState } from "react"
import { KeyboardArrowUpOutlined, KeyboardArrowDownOutlined } from '@mui/icons-material'

export default function Header({ user, logout }: { user: User | null, logout: () => void }) {
  const menuItems = user && getMenuByRole(user.role)
  const labelNames = menuItems?.map((item) => item.label)
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
  }

  const handleProfile = () => {
    router.push("/profile")
  }
  return (
    <AppBar position="fixed" elevation={1} sx={{ minHeight: "50px" }}>
      <Toolbar sx={{ px: 2, ml: { sm: "250px" }, minHeight: "50px" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {labelNames?.find(
            (label) => label === menuItems?.find((item) => item.path === pathname)?.label
          )}
        </Typography>
        {user && (  
          <>
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
                <Typography variant="body2" sx={{ cursor: "pointer" }} onClick={handleProfile}>
                  Thông tin tài khoản
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography variant="body2" sx={{ cursor: "pointer" }} onClick={handleLogout}>
                  Đăng xuất
                </Typography>
              </MenuItem>
            </Menu>
          </>

        )}
      </Toolbar>
    </AppBar>
  )
}