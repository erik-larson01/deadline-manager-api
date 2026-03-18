import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/projects">Projects</NavLink>
          </li>
          <li>
            <NavLink to="/projects/1">Project Detail (Example)</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
