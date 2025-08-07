"use client"

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { projectApi } from "@/lib/api/project-api";
import { devLogApi } from "@/lib/api/devlog-api";
import Toast from "@/components/ui/alert";
import { useDevlogTranslations } from "@/lib/hook/useTranslations";

export default function DevLogsPage() {
  const t = useDevlogTranslations()
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectId: "",
      taskId: "",
      totalHour: 8,
      isOvertime: false,
      content: "",
      logDate: (new Date()).toISOString()
    }
  })

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await projectApi.getProjects()
      setProjects(response.data)
    }
    fetchProjects()
  }, [])

  const selectedProject = watch("projectId")

  useEffect(() => {
    if(selectedProject) {
      const fetchTasks = async () => {
        const response = await projectApi.getProjectTasks(selectedProject)
        setTasks(response.data)
      }
        fetchTasks()
      }
    }, [selectedProject])

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      await devLogApi.addDevLog(data)
      Toast.success(t("create.messages.success"))
    } catch (error: any) {
      Toast.error(
        Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message || t("create.messages.error")
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setValue("logDate", newValue.toDate().toLocaleString());
    } else {
      setValue("logDate", (new Date()).toLocaleString());
    }
  }
  
  return (
    <Container disableGutters>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container className="flex justify-between">
                {/* Project & Task selection */}
                <Grid size={{ xs: 12, md: 6 }} className="flex gap-4">
                  <FormControl fullWidth>
                    <InputLabel id="project-select-label">
                      {t("create.form.selectProject")} <span className="text-red-500">*</span>
                    </InputLabel>
                    <Controller
                      name="projectId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="project-select-label"
                          id="project-select"
                          variant="standard"
                          error={!!errors.projectId}
                        >
                          {projects?.map((project) => (
                            <MenuItem key={project.id} value={project.id}>
                              {project.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="task-select-label">
                      {t("create.form.selectTask")} <span className="text-red-500">*</span>
                    </InputLabel>
                    <Controller
                      name="taskId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="task-select-label"
                          id="task-select"
                          variant="standard"
                          disabled={!selectedProject}
                          error={!!errors.taskId}
                        >
                          {tasks?.map((task) => (
                            <MenuItem key={task.id} value={task.id}>
                              {task.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Hour input */}
                <Grid size={{ xs: 12, md: 4 }} className="flex gap-4">
                  <TextField
                    label={t("create.form.totalHour")}
                    type="number"
                    variant="standard"
                    slotProps={{
                      htmlInput: {
                        step: 0.5,
                        min: 0,
                        max: 24,
                      },
                    }}
                    {...register("totalHour")}
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label={t("create.form.isOvertime")}
                    {...register("isOvertime")}
                  />
                </Grid>
              </Grid>

              {/* Content input */}
              <Grid size={{ xs: 12, md: 12 }} className="flex gap-4 mt-4">
                <TextareaAutosize
                  placeholder={t("create.form.content")}
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                  minRows={3}
                  maxRows={10}
                  {...register("content")}
                />
              </Grid>
              <Box className="mt-5">
                <Button type="submit" variant="contained" size="large" className="mt-4" disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : t("create.button")}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ height: '100%', overflow: 'hidden' }}>
            <Controller
              name="logDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                  <DateCalendar
                    value={dayjs(field.value)}
                    onChange={(newValue) => {
                      handleDateChange(newValue)
                    }}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                    }}
                    showDaysOutsideCurrentMonth={false}
                    disableFuture
                  />
                </LocalizationProvider>
              )}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
