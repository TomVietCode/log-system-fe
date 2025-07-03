import { HomeOutlined, EditNoteOutlined, AccessTimeOutlined, ListAltOutlined } from '@mui/icons-material';

export interface MenuItem {
  label: string
  icon: any
  path: string
  roles: string[]
}

export const menuItems: MenuItem[] = [
  {
    label: "Trang chủ",
    icon: HomeOutlined,
    path: "/dashboard",
    roles: ['ADMIN', 'LEADER', 'HCNS', 'DEV']
  },
  { 
    label: "Nhập Devlogs",
    icon: EditNoteOutlined,
    path: "/devlogs",
    roles: ['DEV', "LEADER"]
  },
  {
    label: "Lịch sử nhập Devlogs",
    icon: AccessTimeOutlined,
    path: "/devlogs/history",
    roles: ['DEV', 'LEADER']
  },
  {
    label: "Dự án",
    icon: ListAltOutlined,
    path: "/projects",
    roles: ['DEV', 'LEADER']
  }
]

export const getMenuByRole = (userRole: string): MenuItem[] => {
  return menuItems.filter(item => item.roles.includes(userRole))
}