import { useState } from 'react'
import { Plus } from 'lucide-react'
import ProgressBar from '../projects/ProgressBar'
import TaskRow from './TaskRow'

function TaskList({tasks, onAddTask, onTaskToggleComplete, onTaskStatusChange, onTaskEdit,onTaskDelete, taskStatusUpdatingIds = []}) {
	// Filter pill options to avoid hardcoding strings
	const FILTER_OPTIONS = {
		ALL: 'ALL',
		TODO: 'TODO',
		IN_PROGRESS: 'IN_PROGRESS',
		OVERDUE: 'OVERDUE',
		DUE_TODAY: 'DUE_TODAY',
	}

	// Sort options for task dropdown to keep option values centralized
	const SORT_OPTIONS = {
		DUE_DATE_ASC: 'dueDate-asc',
		DUE_DATE_DESC: 'dueDate-desc',
		DIFFICULTY_DESC: 'difficulty-desc',
		ESTIMATED_HOURS_DESC: 'estimatedHours-desc',
		STATUS_ASC: 'status-asc',
	}

	const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS.ALL)
	const [sortBy, setSortBy] = useState(SORT_OPTIONS.DUE_DATE_ASC)
	const [showCompleted, setShowCompleted] = useState(false)

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

	// Normalizes date string to timestamp in milliseconds for sorting comparison
	const getTimestamp = (dateString) => {
		if (!dateString) return Number.POSITIVE_INFINITY
		return new Date(`${dateString}T00:00:00`).getTime()
	}

	// Builds due-date metadata once for filtering/grouping logic
	const getTaskDueInfo = (task) => {
		if (!task?.dueDate) {
			return {
				isOverdue: false,
				isDueToday: false,
			}
		}

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const dueDate = new Date(`${task.dueDate}T00:00:00`)
		const diffMs = dueDate.getTime() - today.getTime()
		const dayDifference = Math.floor(diffMs / (1000 * 60 * 60 * 24))

		return {
			isOverdue: dayDifference < 0,
			isDueToday: dayDifference === 0,
		}
	}

	// Applies the selected filter pill to tasks
	const filteredTasks = safeTasks.filter((task) => {
		const dueInfo = getTaskDueInfo(task)

		if (selectedFilter === FILTER_OPTIONS.TODO) {
			return task.status === 'NOT_STARTED'
		}

		if (selectedFilter === FILTER_OPTIONS.IN_PROGRESS) {
			return task.status === 'IN_PROGRESS'
		}

		if (selectedFilter === FILTER_OPTIONS.OVERDUE) {
			return task.status !== 'COMPLETED' && dueInfo.isOverdue
		}

		if (selectedFilter === FILTER_OPTIONS.DUE_TODAY) {
			return task.status !== 'COMPLETED' && dueInfo.isDueToday
		}

		return true
	})

	// Sorts tasks based on selected sort option
	const sortedTasks = [...filteredTasks].sort((a, b) => {
		if (sortBy === SORT_OPTIONS.DUE_DATE_DESC) {
			return getTimestamp(b.dueDate) - getTimestamp(a.dueDate)
		}

		if (sortBy === SORT_OPTIONS.DIFFICULTY_DESC) {
			return Number(b.difficulty) - Number(a.difficulty)
		}

		if (sortBy === SORT_OPTIONS.ESTIMATED_HOURS_DESC) {
			return Number(b.estimatedHours) - Number(a.estimatedHours)
		}

    // Ensure not started comes first then in progress then completed for status sorting
		if (sortBy === SORT_OPTIONS.STATUS_ASC) {
			const statusRank = {
				NOT_STARTED: 0,
				IN_PROGRESS: 1,
				COMPLETED: 2,
			}
			return (statusRank[a.status]) - (statusRank[b.status])
		}

		// Default: due date soonest first
		return getTimestamp(a.dueDate) - getTimestamp(b.dueDate)
	})

	const overdueTasks = sortedTasks.filter((task) => {
		const dueInfo = getTaskDueInfo(task)
		return task.status !== 'COMPLETED' && dueInfo.isOverdue
	})

	const dueTodayTasks = sortedTasks.filter((task) => {
		const dueInfo = getTaskDueInfo(task)
		return task.status !== 'COMPLETED' && dueInfo.isDueToday
	})

	const upcomingTasks = sortedTasks.filter((task) => {
		const dueInfo = getTaskDueInfo(task)
		return task.status !== 'COMPLETED' && !dueInfo.isOverdue && !dueInfo.isDueToday
	})

	const completedTasksList = sortedTasks.filter((task) => task.status === 'COMPLETED')
	const todoTasksCount = safeTasks.filter((task) => task?.status === 'NOT_STARTED').length
	const inProgressTasksCount = safeTasks.filter((task) => task?.status === 'IN_PROGRESS').length

	const overdueTasksCount = safeTasks.filter((task) => {
		const dueInfo = getTaskDueInfo(task)
		return task?.status !== 'COMPLETED' && dueInfo.isOverdue
	}).length

	const dueTodayTasksCount = safeTasks.filter((task) => {
		const dueInfo = getTaskDueInfo(task)
		return task?.status !== 'COMPLETED' && dueInfo.isDueToday
	}).length
 
  // For non "All" filters, visible tasks are just the sorted tasks that match the filter
	const visibleTasksForNonAllFilter = []
  if (selectedFilter !== FILTER_OPTIONS.ALL) {
    visibleTasksForNonAllFilter = showCompleted  ? sortedTasks : sortedTasks.filter(task => task.status !== 'COMPLETED');
  }

  // Checks if there are any tasks to show in the "All" filter
	const hasVisibleTasksInAllGroups =
		overdueTasks.length > 0 ||
		dueTodayTasks.length > 0 ||
		upcomingTasks.length > 0 ||
		(showCompleted && completedTasksList.length > 0)

	return (
		<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5">
			{/** Task completion section with progress bar and task summary info */}
			<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Task Progress</p>

			<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:gap-7">
					<p className="shrink-0 text-sm font-semibold text-gray-800">
						Tasks ({totalTasks})
          </p>

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

			{/** Task Filter and Sort controls */}
			<div className="mt-4 flex flex-wrap items-center gap-3">
        {/** Filter pills */}
				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={() => {
							setSelectedFilter(FILTER_OPTIONS.ALL)
							setShowCompleted(false)
						}}
						className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${selectedFilter === FILTER_OPTIONS.ALL ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'}`}
					>
						All ({totalTasks})
					</button>
					<button
						type="button"
						onClick={() => setSelectedFilter(FILTER_OPTIONS.TODO)}
						className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${selectedFilter === FILTER_OPTIONS.TODO ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'}`}
					>
						To Do ({todoTasksCount})
					</button>
					<button
						type="button"
						onClick={() => setSelectedFilter(FILTER_OPTIONS.IN_PROGRESS)}
						className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${selectedFilter === FILTER_OPTIONS.IN_PROGRESS ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'}`}
					>
						In Progress ({inProgressTasksCount})
					</button>
					<button
						type="button"
						onClick={() => setSelectedFilter(FILTER_OPTIONS.OVERDUE)}
						className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${selectedFilter === FILTER_OPTIONS.OVERDUE ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'}`}
					>
						Overdue ({overdueTasksCount})
					</button>
					<button
						type="button"
						onClick={() => setSelectedFilter(FILTER_OPTIONS.DUE_TODAY)}
						className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${selectedFilter === FILTER_OPTIONS.DUE_TODAY ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'}`}
					>
						Due Today ({dueTodayTasksCount})
					</button>
				</div>

        {/** Sort dropdown */}
				<div className="ml-1 flex items-center gap-3">
					<label htmlFor="task-sort" className="text-xs font-medium uppercase tracking-wide text-gray-500">
						Sort By
					</label>

					<select
						id="task-sort"
						value={sortBy}
						onChange={(event) => setSortBy(event.target.value)}
						className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
					>
						<option value={SORT_OPTIONS.DUE_DATE_ASC}>Due date (Soonest)</option>
						<option value={SORT_OPTIONS.DUE_DATE_DESC}>Due date (Latest)</option>
						<option value={SORT_OPTIONS.DIFFICULTY_DESC}>Difficulty (Hardest first)</option>
						<option value={SORT_OPTIONS.ESTIMATED_HOURS_DESC}>Estimated hours (Most first)</option>
						<option value={SORT_OPTIONS.STATUS_ASC}>Status</option>
					</select>
				</div>

				{selectedFilter === FILTER_OPTIONS.ALL && completedTasksList.length > 0 && (
					<button
						type="button"
						onClick={() => setShowCompleted((prev) => !prev)}
						className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
					>
						{showCompleted ? 'Hide' : 'Show'} completed ({completedTasksList.length})
					</button>
				)}
			</div>

      {/** Lists all tasks as rows */}
			<div className="mt-4 space-y-2">
				{safeTasks.length === 0 ? (
					<div className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-500">
						No tasks yet. Create your first task to start tracking progress.
					</div>
				) : selectedFilter !== FILTER_OPTIONS.ALL && visibleTasksForNonAllFilter.length === 0 ? (
					<div className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-500">
						No matching tasks for this filter.
					</div>
				) : selectedFilter === FILTER_OPTIONS.ALL && !hasVisibleTasksInAllGroups ? (
					<div className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-500">
						No active tasks right now. {completedTasksList.length > 0 ? 'Use Show completed to view finished tasks.' : 'Create your first task to get started.'}
					</div>
				) : (
					selectedFilter === FILTER_OPTIONS.ALL ? (
						<div className="space-y-5">
              {/** Overdue tasks */}
							<section>
								<h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-600">
									Overdue ({overdueTasks.length})
								</h3>
								{overdueTasks.length === 0 ? (
									<div className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-4 text-sm text-gray-500">
										No overdue tasks.
									</div>
								) : (
									<div className="space-y-2">
										{overdueTasks.map((task) => (
											<TaskRow
												key={task.taskId}
												task={task}
												isStatusUpdating={taskStatusUpdatingIds.includes(task.taskId)}
												onToggleComplete={() => onTaskToggleComplete(task)}
												onStatusChange={(nextStatus) => onTaskStatusChange(task, nextStatus)}
												onEdit={() => onTaskEdit(task)}
												onDelete={() => onTaskDelete(task)}
											/>
										))}
									</div>
								)}
							</section>

              {/** Due today tasks */}
							<section>
								<h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">Due Today ({dueTodayTasks.length})</h3>
								{dueTodayTasks.length === 0 ? (
									<div className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-4 text-sm text-gray-500">
										No tasks due today.
									</div>
								) : (
									<div className="space-y-2">
										{dueTodayTasks.map((task) => (
											<TaskRow
												key={task.taskId}
												task={task}
												isStatusUpdating={taskStatusUpdatingIds.includes(task.taskId)}
												onToggleComplete={() => onTaskToggleComplete(task)}
												onStatusChange={(nextStatus) => onTaskStatusChange(task, nextStatus)}
												onEdit={() => onTaskEdit(task)}
												onDelete={() => onTaskDelete(task)}
											/>
										))}
									</div>
								)}
							</section>

              {/** Upcoming tasks */}
							<section>
								<h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">Upcoming ({upcomingTasks.length})</h3>
								{upcomingTasks.length === 0 ? (
									<div className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-4 text-sm text-gray-500">
										No upcoming tasks.
									</div>
								) : (
									<div className="space-y-2">
										{upcomingTasks.map((task) => (
											<TaskRow
												key={task.taskId}
												task={task}
												isStatusUpdating={taskStatusUpdatingIds.includes(task.taskId)}
												onToggleComplete={() => onTaskToggleComplete(task)}
												onStatusChange={(nextStatus) => onTaskStatusChange(task, nextStatus)}
												onEdit={() => onTaskEdit(task)}
												onDelete={() => onTaskDelete(task)}
											/>
										))}
									</div>
								)}
							</section>

              {/** Completed tasks */}
							{showCompleted && completedTasksList.length > 0 && (
								<section>
									<h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
										Completed ({completedTasksList.length})
									</h3>
									<div className="space-y-2">
										{completedTasksList.map((task) => (
											<TaskRow
												key={task.taskId}
												task={task}
												isStatusUpdating={taskStatusUpdatingIds.includes(task.taskId)}
												onToggleComplete={() => onTaskToggleComplete(task)}
												onStatusChange={(nextStatus) => onTaskStatusChange(task, nextStatus)}
												onEdit={() => onTaskEdit(task)}
												onDelete={() => onTaskDelete(task)}
											/>
										))}
									</div>
								</section>
							)}
						</div>
					) : (
						visibleTasksForNonAllFilter.map((task) => (
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
					)
				)}
			</div>
		</div>
	)
}

export default TaskList
