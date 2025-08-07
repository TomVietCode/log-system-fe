"use client"

import { Typography } from "@mui/material";
import { useCommonTranslations } from "@/lib/hook/useTranslations";

export default function DashboardPage() {
  const t = useCommonTranslations()
  return (
    <div>
      <Typography variant="h3">{t("navigation.dashboard")}</Typography>
    </div>
  );
}