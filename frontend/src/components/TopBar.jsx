import { NavLink } from "react-router-dom";
import { Plus, User } from "lucide-react";

function TopBar() {
  return (
    <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
      <NavLink to="/dashboard" className="text-xl font-semibold text-gray-900">
        Momentum
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
