'use client'

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2"
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