// Converts a date to a key in the format 'YYYY-MM-DD'
export const dateToYearMonthDay = (date) => {
	const year = date.getFullYear()
	const month = `${date.getMonth() + 1}`.padStart(2, '0')
	const day = `${date.getDate()}`.padStart(2, '0')

	return `${year}-${month}-${day}`
}

// Parses a task's due date and returns a Date object, or null if no due date
const getTaskDate = (task) => {
	if (!task?.dueDate) return null

	const parsedDate = new Date(`${task.dueDate}T00:00:00`)
	return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

// Checks if a task is due today based on its due date
export const isTaskDueToday = (task) => {
	const taskDate = getTaskDate(task)
	if (!taskDate) return false

	const today = new Date()
	today.setHours(0, 0, 0, 0)

	return taskDate.getTime() === today.getTime()
}

// Checks if a task is overdue based on its due date
export const isTaskOverdue = (task) => {
	const taskDate = getTaskDate(task)
	if (!taskDate) return false

	const today = new Date()
	today.setHours(0, 0, 0, 0)

	return taskDate.getTime() < today.getTime()
}

// Gets the start of the current week (Sunday) as a Date object
export const getStartOfWeek = () => {
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const startOfWeek = new Date(today)
	startOfWeek.setDate(today.getDate() - today.getDay())

	return startOfWeek
}

// Calculates a score for a task based on its project priority and how soon it's due
export const calculateTaskScore = (task, projectPriority) => {
	if (!task?.dueDate) {
		return Number(projectPriority) || 0
	}

	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const dueDate = new Date(`${task.dueDate}T00:00:00`)
	const daysLeft = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24))

	let urgencyMultiplier
	if (daysLeft < 0) urgencyMultiplier = 1.5
	else if (daysLeft === 0) urgencyMultiplier = 1.3
	else if (daysLeft <= 3) urgencyMultiplier = 1.1
	else if (daysLeft <= 7) urgencyMultiplier = 1.0
	else urgencyMultiplier = 0.9

	return (Number(projectPriority) || 0) * urgencyMultiplier
}

// Builds a mapping of date keys to projects and tasks due on those dates for calendar display
export const buildCalendarItems = (projects) => {
	const items = {}

	projects.forEach((project) => {
		if (project.dueDate && project.status !== 'COMPLETED') {
			const key = project.dueDate
			if (!items[key]) items[key] = { tasks: [], projects: [] }
			items[key].projects.push(project)
		}

		project.tasks?.forEach((task) => {
			if (task.dueDate && task.status !== 'COMPLETED') {
				const key = task.dueDate
				if (!items[key]) items[key] = { tasks: [], projects: [] }
				items[key].tasks.push({
					...task,
					projectTitle: project.title,
					projectId: project.projectId,
				})
			}
		})
	})

	return items
}
