import { NavLink } from "react-router-dom";

function TopBar() {
  return (
    <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6">
      <NavLink to="/dashboard" className="text-xl font-semibold text-gray-900">
        Momentum
      </NavLink>

      <div className="flex items-center gap-5">
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-200">
          + New Project
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-xs font-medium text-indigo-600">U</span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
