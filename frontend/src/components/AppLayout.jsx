import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

function AppLayout() {
  return (
    <>
      <TopBar />
      <div>
        <Sidebar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default AppLayout
