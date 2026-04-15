import { Plus } from 'lucide-react'
import ProgressBar from '../projects/ProgressBar'
import TaskRow from './TaskRow'

function TaskList({tasks, onAddTask, onTaskToggleComplete, onTaskStatusChange, onTaskEdit,onTaskDelete, taskStatusUpdatingIds = []}) {
  // Get task completion info for progress bar
	const safeTasks = Array.isArray(tasks) ? tasks : []
	const totalTasks = safeTasks.length
	const completedTasks = safeTasks.filter((task) => task?.status === 'COMPLETED').length

  // Calculate estimated hours remaining by summing the estimated hours of all incomplete tasks
	const estimatedHoursRemaining = safeTasks.reduce((sum, task) => {
		const taskHours = Number(task?.estimatedHours)
		const isIncomplete = task?.status !== 'COMPLETED'

		if (!isIncomplete || Number.isNaN(taskHours) || taskHours < 0) {
			return sum
		}

		return sum + taskHours
	}, 0)

	const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

	// Format estimated hours remaining to show no decimal if it's a whole number, and 1 decimal if it has a fraction, while also handling invalid numbers
	const formattedEstimatedHoursRemaining = Number.isInteger(estimatedHoursRemaining)
		? estimatedHoursRemaining.toString()
		: estimatedHoursRemaining.toFixed(1)

	return (
		<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5">
			{/** Task completion section with progress bar and task summary info */}
			<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Task Progress</p>

			<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:gap-7">
					<p className="shrink-0 text-sm font-semibold text-gray-800">Tasks ({totalTasks})</p>

					<div className="w-36 shrink-0 sm:w-52 lg:w-72 xl:w-lg">
						<ProgressBar completed={completedTasks} total={totalTasks} thick={true} />
					</div>

					<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 lg:shrink-0">
						<span>
							{completedTasks}/{totalTasks}
						</span>
						<span className="text-gray-500">&middot;</span>
						<span>{completionPercentage}%</span>
						<span className="text-gray-500">&middot;</span>
						<span>{formattedEstimatedHoursRemaining}h left</span>
					</div>
				</div>

				{/** Add Task button */}
				<button
					type="button"
					onClick={onAddTask}
					className="self-start flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
				>
					<Plus size={16} />
					Add Task
				</button>
			</div>

      {/** Lists all tasks as rows */}
			<div className="mt-4 space-y-2">
				{safeTasks.length === 0 ? (
					<div className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-500">
						No tasks yet. Create your first task to start tracking progress.
					</div>
				) : (
					safeTasks.map((task) => (
						<TaskRow
							key={task.taskId}
							task={task}
							isStatusUpdating={taskStatusUpdatingIds.includes(task.taskId)}
							onToggleComplete={() => onTaskToggleComplete(task)}
							onStatusChange={(nextStatus) => onTaskStatusChange(task, nextStatus)}
							onEdit={() => onTaskEdit(task)}
							onDelete={() => onTaskDelete(task)}
						/>
					))
				)}
			</div>
		</div>
	)
}

export default TaskList
