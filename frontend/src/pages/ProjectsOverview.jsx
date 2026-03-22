import { useState } from "react"
import { Plus } from "lucide-react"
import CreateProjectModal from "../components/projects/CreateProjectModal"
function ProjectsOverview() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-200">
          <Plus size={16} />
          New Project
        </button>
      </div>
      
      {/* Placeholder for project cards */}
      
      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default ProjectsOverview
