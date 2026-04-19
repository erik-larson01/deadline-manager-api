import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function CalendarDayDetail({ date, items }) {
	const projects = items?.projects ?? []
	const tasks = items?.tasks ?? []
	const totalCount = projects.length + tasks.length

	const headingDate = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	})

	return (
		<div className="mt-4 border-t border-gray-100 pt-3">
      {/** Heading showing the date and item count */}
			<h3 className="text-sm font-semibold text-gray-900">
				{headingDate} - {totalCount} {totalCount === 1 ? 'item' : 'items'}
			</h3>

      {/** Show message if no items, otherwise list projects and tasks */}
			{totalCount === 0 ? (
				<p className="mt-2 text-sm text-gray-500">Nothing due on this day</p>
			) : (
				<div className="mt-2 max-h-40 space-y-3 overflow-y-auto pr-1">
          {/** List projects due on this day */}
					{projects.length > 0 ? (
						<div>
							<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Projects due</p>
							<div className="space-y-1">
								{projects.map((project) => (
									<Link
										key={`project-${project.projectId}`}
										to={`/projects/${project.projectId}`}
										className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
									>
										<span className="truncate">{project.title}</span>
										<ChevronRight size={14} className="shrink-0 text-gray-400" />
									</Link>
								))}
							</div>
						</div>
					) : null}

          {/** List tasks due on this day */}
					{tasks.length > 0 ? (
						<div>
							<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Tasks due</p>
							<div className="space-y-1">
								{tasks.map((task) => {
									const hoursValue = Number(task.estimatedHours)

									return (
										<Link
											key={`task-${task.taskId}`}
											to={task.projectId ? `/projects/${task.projectId}` : '/projects'}
											className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
										>
											<div className="min-w-0 flex-1">
												<p className="truncate font-medium text-gray-800">{task.title}</p>
												<p className="truncate text-xs text-gray-500">{task.projectTitle ?? 'Project'}</p>
											</div>
											<span className="shrink-0 text-xs text-gray-500">
												{Number.isNaN(hoursValue) ? '--' : hoursValue}hrs
											</span>
											<ChevronRight size={14} className="shrink-0 text-gray-400" />
										</Link>
									)
								})}
							</div>
						</div>
					) : null}
				</div>
			)}
		</div>
	)
}

export default CalendarDayDetail
