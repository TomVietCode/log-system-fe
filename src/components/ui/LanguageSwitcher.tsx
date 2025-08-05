'use client'

import { Locale, localeNames, localeFlags, locales } from "@/i18n/config";
import { Box, Button, ListItemText, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useLocale } from "next-intl";
import { useState } from "react";
import LanguageIcon from '@mui/icons-material/Language';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (newLocale: Locale) => {
    // Set cookie for locale
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000;`

    // Reload page to apply new locale
    window.location.reload()

    handleClose()
  }

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        startIcon={<LanguageIcon/>}
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