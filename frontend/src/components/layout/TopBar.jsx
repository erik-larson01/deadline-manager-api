import { NavLink } from "react-router-dom";
import { User } from "lucide-react";

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
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xl font-semibold text-gray-900">Momentum</span>
      </NavLink>

      <div className="flex items-center gap-5">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <User size={16} className="text-indigo-600" />
        </div>
      </div>
    </header>
  );
}

export default TopBar;
