"use client"

import { ProjectFormData } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Autocomplete, Box, Button, Container, Grid, TextField, IconButton, CircularProgress } from "@mui/material"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { userApi } from "@/lib/api/user-api"
import DeleteIcon from '@mui/icons-material/Delete'
import { projectApi } from "@/lib/api/project-api"
import Toast from "@/components/ui/alert"
import { Task } from "@/interface/project"
import { useProjectTranslations } from "@/lib/hook/useTranslations"
import { inputStyle } from "@/styles/common"
import { useValidationSchemas } from "@/lib/hook/useValidation"

export default function CreateProjectPage() {
  const t = useProjectTranslations()
  const [users, setUsers] = useState<any[]>([])
  const [tasks, setTasks] = useState<Array<Task>>([])
  const [loading, setLoading] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<any[]>([])
  const { projectSchema } = useValidationSchemas()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      memberIds: [],
      tasks: []
    }
  })
  
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userApi.getListUser("DEV")
      setUsers(response.data)
    }
    fetchUsers()
  }, [])  

  const addTask = () => {
    const newTasks = [...tasks, { id: null, name: "" }]
    setTasks(newTasks)
    setValue("tasks", newTasks)
  }

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index)
    setTasks(newTasks)
    setValue("tasks", newTasks)
  }

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks]
    newTasks[index] = { id: null, name: value }
    setTasks(newTasks)
    setValue("tasks", newTasks)
  }

  const onSubmit = async (data: ProjectFormData) => {
    // Filter out empty tasks before submitting
    const filteredTasks = tasks.filter(task => task.name?.trim() !== "")
    const submitData = {
      ...data,
      tasks: filteredTasks
    }
    try { 
      setLoading(true)
      await projectApi.createProject(submitData)
      Toast.success(t("messages.createSuccess"))
      // Reset form values
      reset()
      setTasks([])
      setSelectedMembers([]) // Reset selected members
      setLoading(false)
    } catch (error: any) {
      Toast.error(t("messages.createError"))
      setLoading(false)
    }
  }

  return (
    <Container
      sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2, minHeight: "70vh" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container columns={{ xs: 12, md: 12 }} rowSpacing={3} columnSpacing={10}>
          <Grid size={{ xs: 12, md: 5 }} className="flex flex-col gap-6">
            <TextField
              fullWidth
              label={t("form.name")}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={inputStyle}
            />

            <textarea
              rows={4}
              className="block p-2.5 w-full text-md rounded-lg border focus:ring-[#6B98C8] focus:border-[#6B98C8]"
              placeholder={t("form.description")}
              {...register("description")}
            />

            <Box mt={3}>
              <Link href="/projects">
                <Button size="large" variant="outlined" sx={{ mr: 2 }}>
                  {t("actions.back")}
                </Button>
              </Link>

              <Button type="submit" variant="contained" color="primary" size="large">
                {loading ? <CircularProgress size={20} color="inherit" /> : t("actions.add")}
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }} className="flex flex-col gap-6">
            <Controller
              control={control}
              name="memberIds"
              defaultValue={[]}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  multiple
                  options={users}
                  value={selectedMembers}
                  sx={inputStyle}
                  onChange={(event, value) => {
                    setSelectedMembers(value)
                    const selectedIds = value.map((item: any) => item.id)
                    onChange(selectedIds)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("form.members")}
                      error={!!errors.memberIds}
                      helperText={errors.memberIds?.message}
                    />
                  )}
                  getOptionLabel={(option) => `${option.fullName}`}
                  getOptionKey={(option) => option.id}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => {
                    // Extract key from props to pass it directly to the li element
                    const { key, ...otherProps } = props
                    return (
                      <li key={key} {...otherProps}>
                        <input
                          type="checkbox"
                          style={{ marginRight: 8 }}
                          checked={selected}
                          readOnly
                        />
                        {`${option.fullName} - ${option.employeeCode}`}
                      </li>
                    )
                  }}
                />
              )}
            />

            <Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Button variant="contained" color="primary" onClick={addTask}>
                  {t("form.addTask")}
                </Button>
              </Box>

              {tasks.map((task, index) => (
                <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    label={`${t("form.taskName")} ${index + 1}`}
                    value={task.name}
                    onChange={(e) => updateTask(index, e.target.value)}
                    placeholder={t("form.taskName")}
                  />
                  <IconButton color="error" onClick={() => removeTask(index)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}
