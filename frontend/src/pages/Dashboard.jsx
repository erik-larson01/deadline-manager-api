import { useContext } from 'react'
import GreetingHeader from '../components/dashboard/GreetingHeader'
import StatCardsRow from '../components/dashboard/StatCardsRow'
import FocusNow from '../components/dashboard/FocusNow'
import DashboardCalendar from '../components/dashboard/calendar/DashboardCalendar'
import ProjectsStrip from '../components/dashboard/ProjectStrip'
import ProjectsContext from '../contexts/ProjectsContext'
import {buildCalendarItems, calculateTaskScore, getStartOfWeek, isTaskDueToday, isTaskOverdue} from '../utils/taskUtils'

function Dashboard() {
  const { projects } = useContext(ProjectsContext)

  // Flatten all tasks across projects to calculate stats
  const allTasks = projects.flatMap((project) =>
    (project.tasks ?? []).map((task) => ({ ...task, project }))
  )

  // Get incomplete, overdue, and due today tasks from context
  const incompleteTasks = allTasks.filter((task) => task.status !== 'COMPLETED')
  const overdueTasks = incompleteTasks.filter((task) => isTaskOverdue(task))
  const dueTodayTasks = incompleteTasks.filter((task) => isTaskDueToday(task))

  const startOfWeek = getStartOfWeek()

  // Get all tasks completed this week 
  const completedThisWeek = allTasks.filter((task) =>
    task.status === 'COMPLETED' &&
    task.completedAt &&
    new Date(task.completedAt) >= startOfWeek
  )

  const totalHoursRemaining = incompleteTasks.reduce((sum, task) => 
    sum + (Number(task.estimatedHours) || 0), 0
  )

  const activeProjects = projects
    .filter((project) => project.status !== 'COMPLETED')
    .sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0))

  // Calculate focus tasks based on score (priority and urgency)
  const focusTasks = incompleteTasks
    .map((task) => ({
      ...task,
      score: calculateTaskScore(task, Number(task.project?.priority) || 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  // Build calendar items for the month view
  const calendarItems = buildCalendarItems(projects)

  return (
    <div className="space-y-6 p-6">
      <GreetingHeader />

      <StatCardsRow
        dueTodayCount={dueTodayTasks.length}
        overdueCount={overdueTasks.length}
        completedThisWeekCount={completedThisWeek.length}
        totalHoursRemaining={totalHoursRemaining}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FocusNow
          focusTasks={focusTasks}
          totalTaskCount={allTasks.length}
          incompleteCount={incompleteTasks.length}
        />
        <DashboardCalendar calendarItems={calendarItems} />
      </div>

      <ProjectsStrip activeProjects={activeProjects} />
    </div>
  )
}

export default Dashboard
