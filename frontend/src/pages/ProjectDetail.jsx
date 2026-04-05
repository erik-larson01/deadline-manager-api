import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ProjectDetail() {
  // useParams gets the id param from the route /projects/: to be used in the fetch
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // On every id change, fetch that specific projects's data
  useEffect(() => {
    async function fetchProjectById() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`)

        if (!response.ok) {
          throw new Error('Server Error. Failed to fetch project details')
        }

        const data = await response.json()
        setProject(data)
      } catch (fetchError) {
        setError(fetchError.message)
        setProject(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectById()
  }, [id])

  // Render a pulsating card on project load
  if (isLoading) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
      </section>
    )
  }

  // Render a red error message if there was a loading issue
  if (error) {
    return (
      <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">
        <h1 className="text-lg font-semibold">Unable to load project</h1>
        <p className="mt-2 text-sm">{error}</p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
      <p className="mt-2 text-sm text-gray-500">Project ID: {id}</p>
      <p className="mt-2 text-sm text-gray-500">Due-Date: {project.dueDate}</p>
      <p className="mt-2 text-sm text-gray-500">Priority: {project.priority}</p>
      <p className="mt-4 text-gray-700">
        {project.description || 'No description has been added for this project yet.'}
      </p>
    </section>
  )
}

export default ProjectDetail
