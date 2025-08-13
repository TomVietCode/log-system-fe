'use client'

import { Locale, localeNames, localeFlags, locales } from "@/i18n/config";
import { Box, Button, ListItemText, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";
import LanguageIcon from '@mui/icons-material/Language';
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isPending, startTransition] = useTransition()
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      handleClose()
      return
    }

    // ✅ Sử dụng startTransition để thay đổi mượt mà
    startTransition(() => {
      // Set cookie for locale
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=lax`
      
      // ✅ Refresh router thay vì reload page
      router.refresh()
    })

    handleClose()
  }

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        startIcon={<LanguageIcon/>}
        disabled={isPending}
        sx={{ 
          minWidth: 120,
          color: 'white',
          borderColor: 'white',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {localeFlags[locale]} {localeNames[locale]}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {locales.map((lang) => (
          <MenuItem 
            key={lang} 
            onClick={() => handleLanguageChange(lang)}
            selected={lang === locale}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
              {localeFlags[lang]}
            </ListItemIcon>
            <ListItemText>{localeNames[lang]}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}