'use client'

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { projectApi } from "@/lib/api/project-api"
import Toast from "@/components/ui/alert"
import { useProjectTranslations } from "@/lib/hook/useTranslations"

interface Task {
  id?: string | null
  name: string
}

interface AddTaskDialogProps {
  open: boolean
  onClose: () => void
  project: {
    id: string
    name: string
  }
  onTasksAdded?: () => void
}

export default function AddTaskDialog({ 
  open, 
  onClose, 
  project,
  onTasksAdded 
}: AddTaskDialogProps) {
  const t = useProjectTranslations()
  const [tasks, setTasks] = useState<Task[]>([{ id: null, name: "" }])
  const [loading, setLoading] = useState(false)

  const addTask = () => {
    setTasks([...tasks, { id: null, name: "" }])
  }

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index)
    setTasks(newTasks.length ? newTasks : [{ id: null, name: "" }])
  }

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks]
    newTasks[index] = { id: null, name: value }
    setTasks(newTasks)
  }

  const handleSubmit = async () => {
    // Filter out empty tasks
    const validTasks = tasks.filter(task => task.name.trim() !== "")
    
    if (validTasks.length === 0) {
      Toast.error(t("messages.noTasksToAdd"))
      return
    }

    try {
      setLoading(true)
      
      // Call API to add tasks to project
      await projectApi.addTasks(project.id, validTasks)
      
      Toast.success(t("messages.tasksAddedSuccess"))
      onTasksAdded?.()
      handleClose()
    } catch (error) {
      console.error('Add tasks error:', error)
      Toast.error(t("messages.addTasksError"))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTasks([{ id: null, name: "" }])
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">
          {t("dialog.addTasksTitle")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("dialog.project")}: {project.name}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {tasks.map((task, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1, 
                mb: 2 
              }}
            >
              <TextField
                fullWidth
                label={`${t("form.taskName")} ${index + 1}`}
                value={task.name}
                onChange={(e) => updateTask(index, e.target.value)}
                placeholder={t("form.taskNamePlaceholder")}
                variant="outlined"
                size="small"
              />
              <IconButton 
                color="error" 
                onClick={() => removeTask(index)}
                disabled={tasks.length === 1}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={addTask}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          >
            {t("actions.addMoreTask")}
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t("actions.cancel")}
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            t("actions.addTasks")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}