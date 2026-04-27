import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { LogOut, UserCircle2 } from 'lucide-react'

function TopBar() {
  const { user, logout } = useAuth0()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
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

      {/** User profile section */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full ring-indigo-200 transition duration-200 hover:ring-2 focus:outline-none focus:ring-2"
        >
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User profile'}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-gray-900">{user?.name || 'Momentum User'}</p>
              <p className="truncate text-xs text-gray-500">{user?.email || 'No email available'}</p>
            </div>

            <div className="p-1.5">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100"
              >
                <UserCircle2 size={15} className="text-gray-500" />
                Profile (coming soon!)
              </button>

              <button
                type="button"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition-colors duration-200 hover:bg-rose-50"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar
