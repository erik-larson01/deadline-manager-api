import { useEffect, useState } from "react"

function ProgressBar({ completed, total, shouldAnimate = false, thick = false }) {

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

  const trackHeightClass = thick ? "h-3" : "h-2"

  return (
    <div className={`${trackHeightClass} w-full rounded-full bg-gray-100`}>
      <div
        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
        style={{ width: `${displayPercentage}%` }}
      />
    </div>
  )
}

export default ProgressBar