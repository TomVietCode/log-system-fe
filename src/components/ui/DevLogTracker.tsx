"use client"

import { useNotification } from "@/context/notification.context"
import { useProjectTranslations } from "@/lib/hook/useTranslations"
import { Dialog, Typography, DialogContent, DialogTitle, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, DialogActions } from "@mui/material"
import dayjs from "dayjs"

interface DevLogTrackerProps {
  open: boolean
  onClose: () => void
  project: any
}

export default function DevLogTracker({ open, onClose, project }: DevLogTrackerProps) {
  const t = useProjectTranslations()
  const data = project.members
  const today = dayjs().format("DD/MM/YYYY")
  const { sendReminder } = useNotification()

  const handleSendReminder = async (userId: string) => {
    await sendReminder(userId, project.id)
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle component="div"> 
        <Typography className="text-center" variant="h5">
          {t("track.title")}
        </Typography>
        <div className="flex justify-between items-center">
          <Typography variant="h6">
            <span className="font-bold">{t("track.projectName")}: </span>
            <span className="text-gray-600 text-[1rem]">{project.name}</span>
          </Typography>
          <Typography variant="h6">
            <span className="font-bold">{t("track.date")}: </span>
            <span className="text-gray-600 text-[1rem]">{today}</span>
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ mt: 2, border: "1px solid #e0e0e0" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>{t("track.employeeCode")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("track.employeeName")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("track.position")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("track.status")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("track.action")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t("messages.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((member: any) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.employeeCode}</TableCell>
                    <TableCell>{member.fullName}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      {member.logDate && dayjs(member.logDate).format("DD/MM/YYYY") === today ? (
                        <Chip label={t("track.logged")} color="success" />
                      ) : (
                        <Chip label={t("track.notLogged")} color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={member.logDate || member.role === "LEADER"}
                        onClick={() => handleSendReminder(member.id)}
                      >
                        {t("actions.sendNoti")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <DialogActions sx={{ paddingX: 0, paddingY: 2 }}>
          <Button variant="contained" onClick={onClose}>
            {t("actions.close")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
