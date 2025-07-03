'use client'

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6B98C8",
      light: "#F5F5FE",
      dark: "#000000",
    },
    background: {
      default: "#F5F5FE"
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
})

export default function MuiProvider({ children }: { children: ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}