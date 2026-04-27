import { LoaderCircle } from 'lucide-react'

function LoadingScreen() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 text-gray-900">
      <div className="absolute inset-0 bg-linear-to-b from-gray-50 to-white" />

      <div className="relative mx-auto w-full max-w-md rounded-2xl border border-indigo-100 bg-white p-8 text-gray-900 shadow-2xl">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-9 w-9">
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
          <div>
            <p className="text-sm font-medium text-gray-700">Momentum</p>
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