import { Link } from 'react-router-dom'

// Get due date label and styling info based on how close the due date is
const getDueLabel = (dateString) => {
	if (!dateString) return 'No due date'

	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const dueDate = new Date(`${dateString}T00:00:00`)
	const diffMs = dueDate.getTime() - today.getTime()
	const dayDifference = Math.floor(diffMs / (1000 * 60 * 60 * 24))

	if (dayDifference < 0) return 'Overdue'
	if (dayDifference === 0) return 'Due today'
	return `Due in ${dayDifference} ${dayDifference === 1 ? 'day' : 'days'}`
}

// Get badge classes based on task score for styling
const getScoreBadgeClasses = (score) => {
	if (score >= 10) return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
	if (score >= 7) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
	return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
}

function FocusTaskItem({ task, rank }) {
  // Determine project ID for linking, due date label, hours label, and score
	const projectId = task.project?.projectId ?? task.projectId
  
	const dueLabel = getDueLabel(task.dueDate)
	const hoursLabel = Number(task.estimatedHours)
	const score = Number(task.score) || 0

	return (
		<Link
			to={projectId ? `/projects/${projectId}` : '/projects'}
			className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50"
		>
			<span className="w-6 shrink-0 pt-0.5 text-sm font-bold text-gray-400">{rank}</span>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-3">
					<p className="truncate text-sm font-medium text-gray-900">{task.title}</p>
					<span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getScoreBadgeClasses(score)}`}>
						Priority {score.toFixed(1)}
					</span>
				</div>

				<p className="mt-1 truncate text-xs text-gray-500">
					{task.project?.title ?? task.projectTitle ?? 'Project'} • {dueLabel} •{' '}
					{Number.isNaN(hoursLabel) ? '--' : hoursLabel}hrs
				</p>
			</div>
		</Link>
	)
}

export default FocusTaskItem
