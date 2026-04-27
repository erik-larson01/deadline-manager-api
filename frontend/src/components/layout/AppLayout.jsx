import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import ProjectsContext from '../../contexts/ProjectsContext'
import { useAuth0 } from '@auth0/auth0-react'

function AppLayout() {
  const { getAccessTokenSilently } = useAuth0()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all current DB projects by user on mount and load into context
  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)
        setError(null)
        const accessToken = await getAccessTokenSilently()

        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Server Error. Failed to fetch projects")
        }

        const data = await response.json()
        setProjects(data)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <ProjectsContext.Provider value={{ projects, setProjects, isLoading, error }}>
      <div className='flex flex-col h-screen'>
        <TopBar onMenuClick={() => setIsSidebarOpen(prev => !prev)} />
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className='flex-1 overflow-y-auto p-6'>
            {/** Return Outlet only if page is not loading and there is no error, otherwise render a loading or error message */}
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
