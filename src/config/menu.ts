import {
  HomeOutlined,
  EditNoteOutlined,
  AccessTimeOutlined,
  ListAltOutlined,
  PersonOutlineOutlined,
  AddOutlined,
} from "@mui/icons-material"

export interface MenuItem {
  label: string
  icon: any
  path: string
  roles: string[]
  status: "hidden" | "show"
}

export const menuItems: MenuItem[] = [
  {
    label: "Trang chủ",
    icon: HomeOutlined,
    path: "/dashboard",
    roles: ["ADMIN", "LEADER", "HCNS", "DEV"],
    status: "show"
  },
  {
    label: "Nhập Devlogs",
    icon: EditNoteOutlined,
    path: "/devlogs",
    roles: ["DEV", "LEADER"], 
    status: "show"
  },
  {
    label: "Lịch sử nhập Devlogs",
    icon: AccessTimeOutlined,
    path: "/devlog-history",
    roles: ["DEV", "LEADER"],
    status: "show"
  },
  {
    label: "Dự án",
    icon: ListAltOutlined,
    path: "/projects",
    roles: ["DEV", "LEADER"],
    status: "show"
  },
  {
    label: "Tạo dự án",
    icon: AddOutlined,
    path: "/projects/create",
    roles: ["LEADER"],
    status: "hidden"
  },
  {
    label: "Thông tin cá nhân",
    icon: PersonOutlineOutlined,
    path: "/profile",
    roles: ["ADMIN", "LEADER", "HCNS", "DEV"],
    status: "hidden"
  }
]

export const getMenuByRole = (userRole: string): MenuItem[] => {
  return menuItems.filter((item) => item.roles.includes(userRole))
}
