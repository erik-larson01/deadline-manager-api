import { LoaderCircle } from 'lucide-react'

function LoadingScreen() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 text-gray-900">
      <div className="absolute inset-0 bg-linear-to-b from-gray-50 to-white" />

      <div className="relative mx-auto w-full max-w-md rounded-2xl border border-indigo-100 bg-white p-8 text-gray-900 shadow-2xl">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-9 h-9">
            <rect width="48" height="48" rx="10" fill="#4f46e5"/>
            <rect x="7" y="11" width="34" height="8" rx="4" fill="white"/>
            <rect x="7" y="21" width="25" height="8" rx="4" fill="white" opacity="0.6"/>
            <rect x="7" y="31" width="16" height="8" rx="4" fill="white" opacity="0.35"/>
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-700">Tempo</p>
            <h1 className="text-lg font-semibold text-gray-900">Preparing your workspace</h1>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-3 text-sm text-gray-700">
          <LoaderCircle size={18} className="animate-spin text-indigo-600" />
          <span>Checking your secure session...</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen