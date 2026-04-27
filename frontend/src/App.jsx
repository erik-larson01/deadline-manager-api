import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import ProjectsOverview from './pages/ProjectsOverview'
import ProjectDetail from './pages/ProjectDetail'
import NotFound from './pages/NotFound'
import { useAuth0 } from '@auth0/auth0-react'
function App() {
  const { isLoading, isAuthenticated, loginWithRedirect, error } = useAuth0()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div>
        {error && <p>Error: {error.message}</p>}
        <button onClick={() => loginWithRedirect()}>Log In</button>
      </div>
    )
  }
  
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsOverview />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
export default App
