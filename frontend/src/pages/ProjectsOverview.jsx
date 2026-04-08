import { useContext, useState } from "react"
import { Plus } from "lucide-react"
import CreateProjectModal from "../components/projects/CreateProjectModal"
import ProjectsContext from "../contexts/ProjectsContext"
import EditProjectModal from "../components/projects/EditProjectModal"
import DeleteProjectModal from "../components/projects/DeleteProjectModal"
import ProjectCard from "../components/projects/ProjectCard"

function ProjectsOverview() {
  const { projects, setProjects } = useContext(ProjectsContext)

  // List of sort options for project sort dropdown to avoid hardcoding strings
  const SORT_OPTIONS = {
    CREATED_AT_DESC: "createdAt-desc",
    TITLE_ASC: "title-asc",
    PRIORITY_ASC: "priority-asc",
    PRIORITY_DESC: "priority-desc",
    DUE_DATE_ASC: "dueDate-asc",
    DUE_DATE_DESC: "dueDate-desc",
  }

  // States to track status of modal - either open or closed
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // State to track which sort option is selected in the dropdown
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.CREATED_AT_DESC)

  // State to track title search input value
  const [titleSearch, setTitleSearch] = useState("")

  // State to track whether completed projects are shown or hidden
  const [showCompleted, setShowCompleted] = useState(false)

  // State to track which project is selected for editing or deleting
  const [selectedProject, setSelectedProject] = useState(null)

  // Add created project to list of projects in state
  const handleCreatedProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject])
  }

  // Updates the metadata of a project
  const handleUpdatedProject = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        // Update only the project that has a matching projectId with the current selected project
        project.projectId === updatedProject.projectId ? updatedProject : project
      )
    )
    setSelectedProject(null)
  }

  // Removes a project with a given projectId from the state of projects
  const handleDeletedProject = (projectId) => {
    setProjects((prevProjects) => 
      prevProjects.filter((project) =>
        project.projectId !== projectId
      )
    )
  }

  // Opens the project edit modal for a specific project
  const handleOpenEditModal = (event, project) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  // Opens the project delete modal for a specific project
  const handleOpenDeleteModal = (event, project) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedProject(project)
    setIsDeleteModalOpen(true)
  }

  // Normalizes date string to timestamp in milliseconds for sorting comparison
  const getTimestamp = (dateString) => {
    return new Date(dateString).getTime()
  }

  const normalizedTitleSearch = titleSearch.trim().toLowerCase()

  // Filter projects by title
  const filteredProjects = projects.filter((project) => {
    return project.title.toLowerCase().includes(normalizedTitleSearch)
  })

  // Sorts projects based on the selected sort option in the dropdown
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === SORT_OPTIONS.TITLE_ASC) {
      return a.title.localeCompare(b.title, "en", {
        sensitivity: "base",
        numeric: true,
      })
    }

    if (sortBy === SORT_OPTIONS.PRIORITY_ASC) {
      return a.priority - b.priority
    }

    if (sortBy === SORT_OPTIONS.PRIORITY_DESC) {
      return b.priority - a.priority
    }

    if (sortBy === SORT_OPTIONS.DUE_DATE_ASC) {
      return getTimestamp(a.dueDate) - getTimestamp(b.dueDate)
    }

    if (sortBy === SORT_OPTIONS.DUE_DATE_DESC) {
      return getTimestamp(b.dueDate) - getTimestamp(a.dueDate)
    }

    // Default: newest first by creation date.
      return getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
  })

  // Projects that will be rendered as cards. These are calculated after search and sorting have been completed
  const activeProjects = sortedProjects.filter((project) => project.status !== "COMPLETED")
  const completedProjects = sortedProjects.filter((project) => project.status === "COMPLETED")

  const isSearching = normalizedTitleSearch.length > 0
  const allProjectsCompleted = projects.length > 0 && projects.every((project) => project.status === "COMPLETED")

  // If not searching and all projects are completed: show the no active projects default message.
  // If searching with no active matches: show that all matching projects are completed.
  const activeProjectsEmptyMessage = !isSearching && allProjectsCompleted
    ? "No active projects right now."
    : "No active projects match your filters. All matching projects are completed."

  return (
    <div className="p-6">

      {/** Top Section of Projects Overview */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/** Page Title and Search/Sort Controls */}
          <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={titleSearch}
              onChange={(event) => setTitleSearch(event.target.value)}
              placeholder="Search titles"
              aria-label="Search projects by title"
              className="w-52 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <label htmlFor="project-sort" className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Sort
            </label>

            <select
              id="project-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value={SORT_OPTIONS.CREATED_AT_DESC}>Newest first</option>
              <option value={SORT_OPTIONS.TITLE_ASC}>Title (A-Z)</option>
              <option value={SORT_OPTIONS.PRIORITY_ASC}>Priority (Low-High)</option>
              <option value={SORT_OPTIONS.PRIORITY_DESC}>Priority (High-Low)</option>
              <option value={SORT_OPTIONS.DUE_DATE_ASC}>Due date (Soonest)</option>
              <option value={SORT_OPTIONS.DUE_DATE_DESC}>Due date (Latest)</option>
            </select>
          </div>
        </div>

        {/** New Project Button */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-200">
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/** Projects Grid */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No projects yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Create your first project to start tracking deadlines and momentum.
          </p>
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No matching projects</h2>
          <p className="mt-2 text-sm text-gray-500">
            Try a different title search.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/** Active Projects Section with Hide/Show Toggle */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Active Projects</h2>
              {completedProjects.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCompleted((prev) => !prev)}
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                >
                  {showCompleted ? "Hide" : "Show"} completed ({completedProjects.length})
                </button>
              )}
            </div>

            {activeProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
                <p className="text-sm text-gray-600">{activeProjectsEmptyMessage}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {activeProjects.map((project) => (
                  <ProjectCard
                    key={project.projectId}
                    project={project}
                    isCompleted={false}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                  />
                ))}
              </div>
            )}
          </section>

          {/** Completed Projects Section */}
          {showCompleted && completedProjects.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Completed Projects</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {completedProjects.map((project) => (
                  <ProjectCard
                    key={project.projectId}
                    project={project}
                    isCompleted={true}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                  />
                ))}
              </div>
            </section>
          )}
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

      {isDeleteModalOpen && (
        <DeleteProjectModal
          onClose={() => {
            setIsDeleteModalOpen(false)
            setSelectedProject(null)
          }}
          onProjectDeleted={handleDeletedProject}
          project={selectedProject}
        />
      )}
    </div>
  )
}

export default ProjectsOverview
