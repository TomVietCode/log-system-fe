'use client'

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6B98C8",
      light: "#F5F5FE",
      dark: "#648fba"
    },
    text: {
      primary: "#000000",
      // secondary: "#F5F5FE"
    },
    background: {
      default: "#F5F5FE",
      paper: "#ffffff"
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
})

export default function MuiProvider({ children }: { children: ReactNode}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}