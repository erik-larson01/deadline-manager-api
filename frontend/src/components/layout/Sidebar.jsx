import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight, Folder, FolderKanban, LayoutDashboard } from "lucide-react";

function Sidebar() {
  const [projectsOpen, setProjectsOpen] = useState(false);

  const projects = [
    { id: 1, title: "Project A" },
    { id: 2, title: "Project B (With Example Text Overflow)" },
  ];

  return (
    <aside className="h-full w-48 border-r border-gray-200 flex flex-col">
      <nav className="flex-1 p-3 space-y-1">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
            ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`
          }
        >
          <LayoutDashboard size={16} className="mr-2 shrink-0" />
          Dashboard
        </NavLink>

        <div className="flex items-center rounded-md hover:bg-gray-100 transition-colors duration-200">
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `flex-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? "text-indigo-600" : "text-gray-700"}`
            }
          >
            <span className="flex items-center">
              <FolderKanban size={16} className="mr-2 shrink-0" />
              Projects
            </span>
          </NavLink>
          
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="px-2 py-2 text-gray-400"
          >
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${projectsOpen ? "rotate-90" : "rotate-0"}`}
            />
          </button>
        </div>

        {projectsOpen && (
          <div className="space-y-1 pl-3">
            {projects.map((project) => (
              <NavLink
                key={project.id}
                to={`/projects/${project.id}`}
                className={({ isActive }) =>
                  `flex items-center px-3 py-1.5 rounded-md text-sm transition-colors duration-200 truncate
                  ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`
                }
              >
                <Folder size={14} className="mr-2 shrink-0" />
                <span className="truncate" title={project.title}>
                  {project.title}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
