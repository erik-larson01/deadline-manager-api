import CalendarCell from './CalendarCell'
import { dateToYearMonthDay } from '../../../utils/taskUtils'

function CalendarGrid({ currentMonth, calendarItems, selectedDate, onDateClick }) {
	const year = currentMonth.getFullYear()
	const month = currentMonth.getMonth()

	const firstDayOfMonth = new Date(year, month, 1).getDay()

  // Get days in month by creating a date for the 0th day of the next month
	const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Create an array of calendar cells by combining leading and actual days into one array
	const cells = [
		...Array(firstDayOfMonth).fill(null),
		...Array.from({ length: daysInMonth }, (_, index) => index + 1), // Makes array from 1 to daysInMonth
	]

  // Calculate how many empty cells we need to add at the end to fill out the last week (if the last day doesn't fall on a Saturday)
	const trailingCellCount = (7 - (cells.length % 7)) % 7

  // Combine the leading empty cells, the day cells, and the trailing empty cells into one array to render the grid
	const gridCells = [...cells, ...Array(trailingCellCount).fill(null)]

	const todayAsYearMonthDay = dateToYearMonthDay(new Date())

	return (
		<div className="grid grid-cols-7 gap-1">
      {/** Render each calendar cell */}
			{gridCells.map((day, index) => {
				const dateString = day ? dateToYearMonthDay(new Date(year, month, day)) : null
				const items = dateString ? calendarItems[dateString] : null
				const taskCount = items?.tasks?.length ?? 0
				const projectCount = items?.projects?.length ?? 0
				const itemCount = taskCount + projectCount

				const hasOverdue = Boolean(dateString && itemCount > 0 && dateString < todayAsYearMonthDay)

				return (
					<CalendarCell
						key={`${dateString ?? 'empty'}-${index}`}
						day={day}
						dateString={dateString}
						isToday={dateString === todayAsYearMonthDay}
						isSelected={Boolean(dateString && selectedDate === dateString)}
						itemCount={itemCount}
						hasOverdue={hasOverdue}
						onClick={dateString ? () => onDateClick(dateString) : undefined}
					/>
				)
			})}
		</div>
	)
}

export default CalendarGrid
