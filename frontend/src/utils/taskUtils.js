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

// Calculates a priority score for a task based on its due date, estimated hours, difficulty, and project priority
export const calculateTaskScore = (task, project) => {
  if (!task?.dueDate || !project) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(`${task.dueDate}T00:00:00`)
  const daysLeft = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24))

  // Task-level time pressure
  let taskTimePressure
  if (daysLeft < 0) {
    const daysOverdue = Math.abs(daysLeft)
    taskTimePressure = 6.0 + 4.0 / (1.0 + 0.08 * daysOverdue)
  } else if (daysLeft === 0) {
    taskTimePressure = 9.5
  } else {
    taskTimePressure = 9.5 * Math.exp(-0.11 * daysLeft)
  }

  // Work pressure for this specific task
  const hours = Number(task.estimatedHours) || 1
  let taskWorkPressure
  if (daysLeft <= 0) {
    taskWorkPressure = Math.min(10.0, 2.0 + hours * 0.7)
  } else {
    const hoursPerDay = hours / daysLeft
    taskWorkPressure = Math.min(10.0, 10.0 * (1.0 - Math.exp(-0.3 * hoursPerDay)))
  }

  // Task difficulty multiplier
  const difficulty = task.difficulty ?? 5
  const difficultyMultiplier = 1.0 + (difficulty / 15.0)

  // Factor in project priority to increase score for tasks in higher priority projects
  const projectWeight = (Number(project.priority) || 5) / 10.0

  // If this is the last incomplete task in the project, give it a bonus multiplier to reflect importance of finishing the project
  const incompleteTasks = (project.tasks ?? [])
    .filter(t => t.status !== 'COMPLETED')
  const isLastTask = incompleteTasks.length === 1
  const lastTaskBonus = isLastTask ? 1.3 : 1.0


  // Combine the time pressure, work pressure, difficulty, project weight, and last task bonus into a final score
  const taskBaseScore = (taskTimePressure * 0.55) + (taskWorkPressure * 0.45)
  const score = taskBaseScore
    * difficultyMultiplier
    * lastTaskBonus
    * (0.6 + 0.4 * projectWeight)

  return Math.round(score * 100) / 100
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
