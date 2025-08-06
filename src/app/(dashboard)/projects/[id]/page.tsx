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
import { useParams } from "next/navigation"
import { Task } from "@/interface/project"
import { useProjectTranslations } from "@/lib/hook/useTranslations"
import { useValidationSchemas } from "@/lib/hook/useValidation"

export default function UpdateProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const t = useProjectTranslations()
  const { projectSchema } = useValidationSchemas()
  const [users, setUsers] = useState<any[]>([])
  const [tasks, setTasks] = useState<Array<Task>>([])
  const [loading, setLoading] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  })
  
  useEffect(() => {
    const fetchData = async () => {
      const [userResponse, projectResponse] = await Promise.all([
        userApi.getListUser("DEV"),
        projectApi.getProject(projectId)
      ])
      
      setUsers(userResponse.data)
      const projectData = projectResponse.data

      setValue("name", projectData.name)
      setValue("description", projectData.description)
      const selectedMems = userResponse.data.filter((user: any) =>
        projectData.members.some((member: any) => member.id === user.id)
      )
      setSelectedMembers(selectedMems)

      setValue("memberIds", selectedMems.map((member: any) => member.id))
      setTasks(projectData.tasks.map((task: Task) => ({ id: task.id, name: task.name })))
    } 
    fetchData()
    
  }, [])  
  
  // Update form value when tasks change
  useEffect(() => {
    setValue("tasks", tasks.length > 0 ? tasks : [])
  }, [tasks, setValue])
   
  const addTask = () => {
    setTasks([...tasks, { id: null, name: "" }])
  }

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index)
    setTasks(newTasks)
  }

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks]
    newTasks[index] = { id: null, name: value }
    setTasks(newTasks)
  }

  const onSubmit = async (data: ProjectFormData) => {
    // Filter out empty tasks before submitting
    const filteredTasks = tasks.filter(task => task.name.trim() !== "")
    const submitData = {
      ...data,
      tasks: filteredTasks
    }

    try { 
      setLoading(true)
      const response = await projectApi.updateProject(projectId, submitData)
      Toast.success(t("messages.updateSuccess"))
      // Reset form values
      setLoading(false)
    } catch (error: any) {
      Toast.error(t("messages.updateError"))
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
              slotProps={{ inputLabel: { shrink: !!watch("name") } }}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
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
                {loading ? <CircularProgress size={20} color="inherit" /> : t("actions.update")}
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }} className="flex flex-col gap-6">
            <Controller
              control={control}
              name="memberIds"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={users}
                  value={selectedMembers}
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
