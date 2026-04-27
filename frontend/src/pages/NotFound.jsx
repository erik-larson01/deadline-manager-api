import { useAuth0 } from '@auth0/auth0-react'
import { Home, LayoutDashboard, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFound() {
  const { isAuthenticated } = useAuth0()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-white via-indigo-50/40 to-indigo-100/45 px-6 py-14 text-gray-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-indigo-300/45 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <section className="animate-fade-up relative w-full max-w-2xl rounded-3xl border border-indigo-100 bg-white/95 p-7 shadow-xl sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
          <ShieldAlert size={14} className="text-indigo-500" />
          404
        </span>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Page Not Found</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600">
          The page you requested could not be found or may no longer be available.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-700"
          >
            {isAuthenticated ? <LayoutDashboard size={16} /> : <Home size={16} />}
            {isAuthenticated ? 'Go to Dashboard' : 'Go Home'}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default NotFound