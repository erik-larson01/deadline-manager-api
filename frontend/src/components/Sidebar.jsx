import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-48 border-r border-gray-200 flex flex-col">
      <nav className="flex-1 p-3 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
            ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
            ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`
          }
        >
          Projects
        </NavLink>

      </nav>

      <div className="p-3 border-t border-gray-200">
        <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
