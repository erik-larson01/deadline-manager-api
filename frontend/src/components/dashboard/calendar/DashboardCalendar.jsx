import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CalendarGrid from './CalendarGrid'
import CalendarDayDetail from './CalendarDayDetail'
import { dateToYearMonthDay } from '../../../utils/taskUtils'

function DashboardCalendar({ calendarItems }) {
  // States to track the currently displayed month and the selected date for details view
	const [currentMonth, setCurrentMonth] = useState(new Date())
	const [selectedDate, setSelectedDate] = useState(dateToYearMonthDay(new Date()))

	const goToPrevMonth = () => {
		setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
	}

	const goToNextMonth = () => {
		setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
	}

	const goToToday = () => {
		const today = new Date()
		setCurrentMonth(today)
		setSelectedDate(dateToYearMonthDay(today))
	}

	const monthLabel = currentMonth.toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric',
	})

	return (
		<section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/** Calendar Navigation */}
			<div className="mb-3 flex items-center justify-between gap-3">
        {/** Buttons for Month Navigation */}
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={goToPrevMonth}
						className="rounded-md p-1 text-gray-600 transition-colors hover:bg-gray-100"
						aria-label="Previous month"
					>
						<ChevronLeft size={16} />
					</button>
					<span className="text-sm font-semibold text-gray-900">{monthLabel}</span>
					<button
						type="button"
						onClick={goToNextMonth}
						className="rounded-md p-1 text-gray-600 transition-colors hover:bg-gray-100"
						aria-label="Next month"
					>
						<ChevronRight size={16} />
					</button>
				</div>

				<button
					type="button"
					onClick={goToToday}
					className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
				>
					Today
				</button>
			</div>

      {/** Weekday Labels */}
			<div className="mb-2 grid grid-cols-7">
				{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayName) => (
					<span key={dayName} className="text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
						{dayName}
					</span>
				))}
			</div>

      {/** Calendar Grid of dates */}
			<CalendarGrid
				currentMonth={currentMonth}
				calendarItems={calendarItems}
				selectedDate={selectedDate}
				onDateClick={setSelectedDate}
			/>

      {/** Detail view for the selected date when one is selected */}
			{selectedDate ? (
				<CalendarDayDetail date={selectedDate} items={calendarItems[selectedDate]} />
			) : null}
		</section>
	)
}

export default DashboardCalendar
