import { X, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"

function EditProjectModal({ onClose, onProjectEdited, project }) {
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Form to be passed to API when updating project
  const [form, setForm] = useState({
    title: "",
    dueDate: "",
    status: "NOT_STARTED",
    category: "",
    description: "",
    difficulty: 5,
    estimatedHours: "",
  })

  // Load the selected project's data into the form so it can be edited
  useEffect(() => {
    // Don't set the form for the modal if there is no project data
    if (!project) return

    setForm({
      title: project.title || "",
      dueDate: project.dueDate || "",
      status: project.status || "NOT_STARTED",
      category: project.category || "",
      description: project.description || "",
      difficulty: project.difficulty ?? 5,
      estimatedHours: project.estimatedHours ?? "",
    })
  }, [project])

  const handleInputChange = (e) => {
    // Ensure difficulty is always a number not a string
    const { name, value } = e.target
    const parsedValue = name === "difficulty" ? Number(value) : value

    setForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }))
  }

  // Updates the project via PUT in the database, updates the project fields within the shared projects context, then closes the form
  async function handleFormSubmit(e) {
    e.preventDefault()
    setSubmitError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${project.projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          dueDate: form.dueDate,
          status: form.status,
          category: form.category || null,
          description: form.description || null,
          difficulty: form.difficulty,
          estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : null,
        }),
      })

      // On error, retrieve the error message to display to the user
      if (!response.ok) {
        let message = "Failed to update project." // Default

        if (response.status >= 500) {
          message = "Server error. Please try again later."
        } else {
          try {
            const errorData = await response.json()
            message = errorData.message || message
          } catch {} // If the error did not return json (failed to fetch)
        }

        throw new Error(message)
      }

      const updatedProject = await response.json()
      onProjectEdited(updatedProject)
      onClose()
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = form.title.trim() !== "" && form.dueDate !== ""

  // Don't render the modal if there is no project data
  if (!project) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40"/>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-lg">

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-700">Edit Project</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <form id="edit-project-form" className="space-y-5" onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    id="title"
                    name="title"
                    type="text"
                    maxLength={255}
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="Enter project title"
                    className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200
                      ${submitError?.toLowerCase().includes("title")
                        ? "border-red-500"
                        : "border-gray-300"
                      }`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      id="dueDate"
                      name="dueDate"
                      value={form.dueDate}
                      onChange={handleInputChange}
                      min={new Date(project.createdAt).toISOString().split('T')[0]}
                      type="date"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={form.category}
                    onChange={handleInputChange}
                    placeholder="Work, School, Personal"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    maxLength={2000}
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Add notes about this project"
                    className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                    Difficulty (1-10)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="difficulty"
                      name="difficulty"
                      type="range"
                      min="1"
                      max="10"
                      value={form.difficulty}
                      onChange={handleInputChange}
                      className="flex-1 accent-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700 w-6 text-center">{form.difficulty}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
                    Estimated Time (Hours)
                  </label>
                  <input
                    id="estimatedHours"
                    name="estimatedHours"
                    type="number"
                    value={form.estimatedHours}
                    onChange={handleInputChange}
                    min="0.5"
                    step="0.5"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>
            </form>
          </div>

          {submitError && (
            <p className="text-sm text-red-500 px-6 py-2 border-t border-red-100">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button onClick={onClose} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-200">
              Cancel
            </button>
            <button 
              form="edit-project-form" type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200"
              disabled={!isValid}
            >
              {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={16} />
                    Editing...
                  </>
                ) : ("Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </>

  )
}
export default EditProjectModal
