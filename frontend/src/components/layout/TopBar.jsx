import { NavLink } from "react-router-dom";
import { Plus, User } from "lucide-react";

function TopBar() {
  return (
    <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
      <NavLink to="/dashboard" className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-6 h-6"
        >
          <rect width="32" height="32" rx="6" fill="#4f46e5" />
          <polyline
            points="6,24 13,16 19,20 26,8"
            fill="none"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span className="text-xl font-semibold text-gray-900">Momentum</span>
      </NavLink>

      <div className="flex items-center gap-5">
        <button className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-200">
          <Plus size={16} />
          New Project
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <User size={16} className="text-indigo-600" />
        </div>
      </div>
    </header>
  );
}

export default TopBar;
