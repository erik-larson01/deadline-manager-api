import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import ProjectsContext from '../../contexts/ProjectsContext'

function AppLayout() {
  const [projects, setProjects] = useState([])

  // Fetch all current DB projects on mount
  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`)

      if (!response.ok) {
        throw new Error("Server Error. Failed to fetch projects")
      }

      const data = await response.json()
      setProjects(data)
    }

    fetchProjects()
  }, [])

  return (
    <ProjectsContext.Provider value={[projects, setProjects]}>
      <div className='flex flex-col h-screen'>
        <TopBar />
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar />
          <main className='flex-1 overflow-y-auto p-6'>
            <Outlet />
          </main>
        </div>
      </div>
    </ProjectsContext.Provider>
  )
}

export default AppLayout
