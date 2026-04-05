import { useContext, useState } from "react"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
import CreateProjectModal from "../components/projects/CreateProjectModal"
import ProjectsContext from "../contexts/ProjectsContext"

function ProjectsOverview() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { projects, setProjects } = useContext(ProjectsContext)

  // Add created project to list of projects in state without refetching from API
  const handleCreatedProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject])
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
    if (!status) return "Unknown"
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
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
          {projects.map((project) => (
            <Link
              key={project.projectId}
              to={`/projects/${project.projectId}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-indigo-700">
                  {project.title}
                </h2>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(project.status)}`}
                >
                  {formatStatus(project.status)}
                </span>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Due Date
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {formatDueDate(project.dueDate)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsModalOpen(false)}
          onProjectCreated={handleCreatedProject}
        />
      )}
    </div>
  )
}

export default ProjectsOverview
