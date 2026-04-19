import { Link } from 'react-router-dom'
import FocusTaskItem from './FocusTaskItem'
import { ArrowRight } from 'lucide-react'

function FocusNow({ focusTasks, totalTaskCount = 0, incompleteCount = 0 }) {
	return (
		<section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-base font-semibold text-gray-900">Focus Now</h2>
				<span className="text-xs font-medium text-gray-500">Top 5</span>
			</div>

      {/** Show different messages based on task counts */}
			{totalTaskCount === 0 ? (
				<p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-sm text-gray-600">
					Create some projects and tasks to get started
				</p>
			) : incompleteCount === 0 ? (
				<p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-sm text-gray-600">
					All caught up! Add more tasks to keep going.
				</p>
			) : (
				<div className="space-y-1">
					{focusTasks.map((task, index) => (
						<FocusTaskItem key={task.taskId ?? `${task.title}-${index}`} task={task} rank={index + 1} />
					))}
				</div>
			)}

			<div className="mt-4 border-t border-gray-100 pt-3">
				<Link
					to="/projects"
					className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
				>
					View all Projects <ArrowRight size={16} className="inline" />
				</Link>
			</div>
		</section>
	)
}

export default FocusNow
