import { useAuth0 } from '@auth0/auth0-react'
import { ArrowRight, BarChart3, CalendarClock, CheckCircle2, GraduationCap } from 'lucide-react'

function LandingPage({ error }) {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-white via-indigo-50/30 to-indigo-100/40 text-gray-900">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-12 pt-10 sm:px-10">
        {/* Header section with title and sign in */}
        <header className="animate-fade-in-slow flex items-center justify-between">
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
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">Momentum</p>
              <p className="text-sm text-gray-600">A workload ranking system for students</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'login' } })}
            className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-indigo-50"
          >
            Sign in
          </button>
        </header>

       {/* Main content section with features and call to action */}
        <main className="mt-14 grid gap-10 lg:grid-cols-[1.10fr_0.90fr] lg:items-center">
          <section className="animate-fade-up space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">
              <BarChart3 size={14} className="text-indigo-500" />
              Real-time task prioritization
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Your projects, ranked by what actually needs attention right now.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
                Momentum organizes your classes, projects, and tasks into a single ranked system so you always know what deserves attention next.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            )}

            {/* Sign Up Button and Log In Button */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => loginWithRedirect()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-400"
              >
                Start Planning
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'login' } })}
                className="rounded-lg border border-indigo-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition duration-200 hover:bg-indigo-50"
              >
                I already have an account
              </button>
            </div>

            {/* Features section */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm hover:bg-indigo-50 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
                <GraduationCap size={16} className="text-indigo-500" />
                <p className="mt-2 text-sm font-medium text-gray-900">Canvas Integration</p>
                <p className="mt-1 text-xs text-gray-600">Import assignments and deadlines directly from Canvas.</p>
              </div>
              <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm hover:bg-indigo-50 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
                <CalendarClock size={16} className="text-indigo-500" />
                <p className="mt-2 text-sm font-medium text-gray-900">Deadline aware planning</p>
                <p className="mt-1 text-xs text-gray-600">Urgency increases as deadlines approach.</p>
              </div>
              <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm hover:bg-indigo-50 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <p className="mt-2 text-sm font-medium text-gray-900">Weekly completion tracking</p>
                <p className="mt-1 text-xs text-gray-600">Track progress and consistency across all work.</p>
              </div>
            </div>
          </section>

          {/** Focus view section with example ranked tasks */}
          <section className="animate-fade-up-delay rounded-3xl border border-indigo-100 bg-white p-5 shadow-xl sm:p-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">Focus View</p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">What to work on next</h2>
                </div>

                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">Live</span>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3 hover:bg-indigo-50 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">STAT 340 Final Report</p>
                    <span className="text-xs font-semibold text-rose-600">9.1</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Due tomorrow · high workload</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3 hover:bg-indigo-50 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">History Seminar Paper: Cold War Case Study</p>
                    <span className="text-xs font-semibold text-amber-600">7.8</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Due in 4 days · medium priority</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3 hover:bg-indigo-50 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">Chapter 7 Textbook Reading</p>
                    <span className="text-xs font-semibold text-indigo-600">5.9</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Due next week · low urgency</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-700">
                Items are ranked using urgency, estimated workload, and deadline proximity.
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default LandingPage