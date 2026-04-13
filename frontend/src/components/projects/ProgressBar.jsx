import { useEffect, useRef, useState } from "react"

function ProgressBar({ completed, total, thick = false }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  const [displayPercentage, setDisplayPercentage] = useState(0)

  // Ref to track if the progress bar has already animated from 0 to prevent animation restarts on task completion
  const hasAnimatedFromZeroRef = useRef(false)

  // On mount and whenever percentage changes, animate the progress bar from 0 to the new percentage
  useEffect(() => {
    // If the progress bar has already animated from 0, jump directly to the new percentage without animating again
    if (hasAnimatedFromZeroRef.current) {
      setDisplayPercentage(percentage)
      return
    }

    setDisplayPercentage(0)

    // Use requestAnimationFrame for a smooth animation from 0 to the target percentage
    const animationFrameId = requestAnimationFrame(() => {
      setDisplayPercentage(percentage)
      hasAnimatedFromZeroRef.current = true
    })

    return () => cancelAnimationFrame(animationFrameId)
  }, [percentage])

  const trackHeightClass = thick ? "h-3" : "h-2"

  return (
    <div className={`${trackHeightClass} w-full rounded-full bg-gray-200`}>
      <div
        className="h-full rounded-full bg-indigo-500 transition-all duration-2000"
        style={{ width: `${displayPercentage}%` }}
      />
    </div>
  )
}

export default ProgressBar