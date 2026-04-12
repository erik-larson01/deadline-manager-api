import { useEffect, useState } from "react"

function ProgressBar({completed, total, shouldAnimate = false, detailed = false, 
  estimatedHoursRemaining = null, difficulty = null,}) {

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  // Display percentage state to control animation based on whether animation should occur
  const [displayPercentage, setDisplayPercentage] = useState(shouldAnimate ? 0 : percentage)

  // On mount, if shouldAnimate is true, animate the progress bar from 0 to the correct percentage.
  useEffect(() => {
    if (!shouldAnimate) {
      return
    }

    setDisplayPercentage(percentage)
  }, [percentage, shouldAnimate]) // Update animation if percentage changes

  const hasEstimatedHours = typeof estimatedHoursRemaining === "number" && Number.isFinite(estimatedHoursRemaining)
  const formattedEstimatedHours = hasEstimatedHours
    ? Number.isInteger(estimatedHoursRemaining)
      ? estimatedHoursRemaining.toString()
      : estimatedHoursRemaining.toFixed(1)
    : null

  const hasDifficulty = typeof difficulty === "number" && Number.isFinite(difficulty)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Task Completion</span>
        <span>{completed}/{total} tasks</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>

      {/** Detailed Info for ProjectDetail page */}
      {detailed && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-gray-600">
          <span>{percentage}% complete</span>
          <span>
            Estimated hours remaining: {formattedEstimatedHours ?? "N/A"}
          </span>
          <span>Difficulty: {hasDifficulty ? `${difficulty}/10` : "N/A"}</span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar