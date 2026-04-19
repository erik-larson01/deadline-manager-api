import { AlertCircle, CheckCircle2, Clock, Timer } from 'lucide-react'
import StatCard from './StatCard'

function StatCardsRow({dueTodayCount, overdueCount, completedThisWeekCount, totalHoursRemaining }) {
  // Determine text color based on count of due today and overdue tasks
	const dueTodayColor = dueTodayCount > 0 ? 'text-indigo-600' : 'text-gray-700'
	const overdueColor = overdueCount > 0 ? 'text-rose-600' : 'text-gray-700'

	return (
		<section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			<StatCard
				label="Due Today"
				value={dueTodayCount}
				valueColor={dueTodayColor}
				icon={Clock}
			/>
			<StatCard
				label="Overdue"
				value={overdueCount}
				valueColor={overdueColor}
				icon={AlertCircle}
			/>
			<StatCard
				label="Completed"
				value={completedThisWeekCount}
				valueColor="text-emerald-600"
				icon={CheckCircle2}
				subLabel="this week"
			/>
			<StatCard
				label="Hours Remaining"
				value={Math.round(totalHoursRemaining * 10) / 10}
				valueColor="text-gray-700"
				icon={Timer}
			/>
		</section>
	)
}

export default StatCardsRow
