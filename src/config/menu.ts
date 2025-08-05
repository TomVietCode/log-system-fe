import {
  HomeOutlined,
  EditNoteOutlined,
  AccessTimeOutlined,
  ListAltOutlined,
  PersonOutlineOutlined,
  AddOutlined,
  Group,
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
    label: "navigation.dashboard",
    icon: HomeOutlined,
    path: "/dashboard",
    roles: ["LEADER", "DEV"],
    status: "show"
  },
  {
    label: "navigation.devlogs",
    icon: EditNoteOutlined,
    path: "/devlogs",
    roles: ["DEV", "LEADER"], 
    status: "show"
  },
  {
    label: "navigation.devlogHistory",
    icon: AccessTimeOutlined,
    path: "/devlog-history",
    roles: ["DEV", "LEADER"],
    status: "show"
  },
  {
    label: "navigation.projects",
    icon: ListAltOutlined,
    path: "/projects",
    roles: ["DEV", "LEADER"],
    status: "show"
  },
  {
    label: "navigation.createProject",
    icon: AddOutlined,
    path: "/projects/create",
    roles: ["LEADER"],
    status: "hidden"
  },
  {
    label: "navigation.profile",
    icon: PersonOutlineOutlined,
    path: "/profile",
    roles: ["ADMIN", "LEADER", "HCNS", "DEV"],
    status: "hidden"
  },
  {
    label: "navigation.accounts",
    icon: Group,
    path: "/accounts",
    roles: ["ADMIN", "HCNS"],
    status: "show"
  }
]

export const getMenuByRole = (userRole: string): MenuItem[] => {
  return menuItems.filter((item) => item.roles.includes(userRole))
}
