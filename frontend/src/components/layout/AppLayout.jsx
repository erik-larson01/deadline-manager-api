import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import ProjectsContext from '../../contexts/ProjectsContext'

function AppLayout() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all current DB projects on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`)

        if (!response.ok) {
          throw new Error("Server Error. Failed to fetch projects")
        }

        const data = await response.json()
        setProjects(data)
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load projects")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <ProjectsContext.Provider value={{ projects, setProjects, isLoading, error }}>
      <div className='flex flex-col h-screen'>
        <TopBar />
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar />
          <main className='flex-1 overflow-y-auto p-6'>
            {isLoading ? (
              <div className='flex min-h-[60vh] items-center justify-center rounded-xl border border-gray-200 bg-white p-8 shadow-sm'>
                <LoaderCircle className='h-20 w-20 animate-spin text-indigo-600' />
              </div>
            ) : error ? (
              <div className='rounded-xl border border-rose-200 bg-rose-50 p-8 text-rose-800 shadow-sm'>
                <h2 className='text-lg font-semibold'>Failed to load projects</h2>
                <p className='mt-2 text-sm'>{error}</p>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </ProjectsContext.Provider>
  )
}

export default AppLayout
