import { useContext, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import CreateProjectModal from "../components/modals/CreateProjectModal"
import ProjectsContext from "../contexts/ProjectsContext"
import EditProjectModal from "../components/modals/EditProjectModal"

function ProjectsOverview() {
  const { projects, setProjects } = useContext(ProjectsContext)

  // States to track status of modal - either open or closed
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // State to track which project 
  const [selectedProject, setSelectedProject] = useState(null)

  // Add created project to list of projects in state without refetching from API
  const handleCreatedProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject])
  }

  // Updates state of a projects by changing only the project with a matching projectId to the selected project
  const handleUpdatedProject = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.projectId === updatedProject.projectId ? updatedProject : project
      )
    )
    setSelectedProject(null)
  }

  const handleDeletedProject = (projectId) => {
    
  }
  // Opens the project edit modal for a specific project
  const handleOpenEditModal = (event, project) => {
    event.preventDefault()
    // Stops a click from also clicking the project card
    event.stopPropagation()
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  // Formats the API dueDate string to readable text
  const formatDueDate = (dateString) => {
    if (!dateString) return "No due date"

    const dueDate = new Date(`${dateString}T00:00:00`)
    return dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Updates card style based on completion status
  const getStatusStyle = (status) => {
    const styles = {
      COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
      IN_PROGRESS: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
      NOT_STARTED: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
    }

    return styles[status]
  }

  // Transform project API status to readable text "IN_PROGRESS" -> In Progress
  const formatStatus = (status) => {
    // Handles backend error
    if (!status) return "Unknown"

    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Creates dynamic coloring for priority based on priority value {label, style}
  const getPriorityInfo = (priority) => {
    const numericPriority = Number(priority)

    // Handles backend error
    if (Number.isNaN(numericPriority)) {
      return {
        label: "No Priority",
        style: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
      }
    }

    if (numericPriority >= 7) {
      return {
        label: `Priority ${numericPriority.toFixed(1)}`,
        style: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
      }
    }

    if (numericPriority >= 4) {
      return {
        label: `Priority ${numericPriority.toFixed(1)}`,
        style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      }
    }

    return {
      label: `Priority ${numericPriority.toFixed(1)}`,
      style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    }
  }

  // Creates dynamic coloring for "due in X days" based on difference from today to due date (Red, Yellow, Green)
  const getDueInfo = (dateString) => {
    // Handles backend error
    if (!dateString) {
      return {
        label: "No due date",
        style: "bg-gray-100 text-gray-600",
      }
    }

    // Normalizes today to midnight
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Forces due date to midnight, finds the diff in ms, and calculates the difference in days
    const dueDate = new Date(`${dateString}T00:00:00`)
    const diffMs = dueDate.getTime() - today.getTime()
    const dayDifference = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (dayDifference < 0) {
      return {
        label: "Overdue",
        style: "bg-rose-100 text-rose-700",
      }
    }

    if (dayDifference === 0) {
      return {
        label: "Due today",
        style: "bg-amber-100 text-amber-700",
      }
    }

    return {
      label: `${dayDifference} ${dayDifference === 1 ? "day" : "days"} left`,
      style: "bg-emerald-100 text-emerald-700",
    }
  }

  return (
    <div className="p-6">

      {/** Top Row of Projects Overview */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-200">
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/** Cards per project */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No projects yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Create your first project to start tracking deadlines and momentum.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const priorityInfo = getPriorityInfo(project.priority)
            const dueInfo = getDueInfo(project.dueDate)

            return (
              <div
                key={project.projectId}
                className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
              >
                <Link
                  to={`/projects/${project.projectId}`}
                  className="block"
                >
                  {/** Top Row of Title, Status, and Category */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <h2 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-indigo-700">
                        {project.title}
                      </h2>
                      {project.category && (
                        <span
                          className="inline-flex max-w-48 truncate rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                          title={project.category}
                        >
                          {project.category}
                        </span>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(project.status)}`}
                    >
                      {formatStatus(project.status)}
                    </span>
                  </div>

                  {/** Task Completion Box with Priority and Days Left */}
                  <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-3">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-gray-600">
                        <span>Task Completion</span>
                        <span>0/0 tasks</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-full w-0 rounded-full bg-indigo-500" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityInfo.style}`}
                      >
                        {priorityInfo.label}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${dueInfo.style}`}
                      >
                        {dueInfo.label}
                      </span>
                    </div>
                  </div>

                  {/** Due Date Section */}
                  <div className="mt-4 border-t border-gray-200 pt-4 pr-11">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Due Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {formatDueDate(project.dueDate)}
                    </p>
                  </div>
                </Link>
                
                <div className="flex justify-end gap-2">
                  <button
                  type="button"
                  onClick={(event) => handleOpenEditModal(event, project)}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-2 text-indigo-700 opacity-0 transition-all duration-200 hover:bg-indigo-200 hover:text-indigo-800 group-hover:opacity-100"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                  type="button"
                  onClick={(event) => handleDeletedProject(event, project.projectId)}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-2 text-indigo-700 opacity-0 transition-all duration-200 hover:bg-indigo-200 hover:text-indigo-800 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsCreateModalOpen(false)}
          onProjectCreated={handleCreatedProject}
        />
      )}

      {isEditModalOpen && (
        <EditProjectModal
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedProject(null)
          }}
          onProjectEdited={handleUpdatedProject}
          project={selectedProject}
        />
      )}
    </div>
  )
}

export default ProjectsOverview
