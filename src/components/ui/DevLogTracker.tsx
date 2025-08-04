import { Dialog, Typography, DialogContent, DialogTitle, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, DialogActions } from "@mui/material"
import dayjs from "dayjs"
import { useState } from "react"

interface DevLogTrackerProps {
  open: boolean
  onClose: () => void
  project: any
}

export default function DevLogTracker({ open, onClose, project }: DevLogTrackerProps) {
  const [data, setData] = useState<any[]>(project.members)
  const [loading, setLoading] = useState(false)
  const today = dayjs().format("DD/MM/YYYY")

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6" className="text-center">
          Theo dõi DevLog nhân viên
        </Typography>
        <div className="flex justify-between items-center">
          <Typography variant="h6">
            <span className="font-bold">Tên dự án: </span>
            <span className="text-gray-600 text-[1rem]">{project.name}</span>
          </Typography>
          <Typography variant="h6">
            <span className="font-bold">Ngày: </span>
            <span className="text-gray-600 text-[1rem]">{today}</span>
          </Typography> 
        </div>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ mt: 2, border: "1px solid #e0e0e0" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>MÃ NV</strong></TableCell>
                <TableCell><strong>TÊN NV</strong></TableCell>
                <TableCell><strong>VỊ TRÍ</strong></TableCell>
                <TableCell><strong>TRẠNG THÁI</strong></TableCell>
                <TableCell><strong>HÀNH ĐỘNG</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có thành viên nào
                  </TableCell>
                </TableRow>
              ) : (
                data.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.employeeCode}</TableCell>
                    <TableCell>{member.fullName}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      {member.logDate ? (
                        <Chip label="Đã nhập" color="success" />
                      ) : (
                        <Chip label="Chưa nhập" color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" disabled={member.logDate || member.role === "LEADER"}>
                        Gửi thông báo
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
            Đóng
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
