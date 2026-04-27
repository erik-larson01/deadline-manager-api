import { X, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { useAuth0 } from '@auth0/auth0-react'

function DeleteProjectModal({ onClose, onProjectDeleted, project }) {
  const { getAccessTokenSilently } = useAuth0()
	const [isLoading, setIsLoading] = useState(false)
	const [submitError, setSubmitError] = useState(null)

	if (!project) return null

  // Deletes a project via DELETE in the database, updates the projects list, then closes the modal
	async function handleDeleteProject() {
		setSubmitError(null)
		setIsLoading(true)
    
		try {
			const accessToken = await getAccessTokenSilently()
      
			const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${project.projectId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

      // On error, retrieve the error message to display to the user
			if (!response.ok) {
				let message = "Failed to delete project."

				if (response.status >= 500) {
					message = "Server error. Please try again later." // Default
				} else {
					try {
						const errorData = await response.json()
						message = errorData.message || message
					} catch {} // If the error did not return json (failed to fetch)
				}

				throw new Error(message)
			}

			onProjectDeleted(project.projectId)
			onClose()
		} catch (error) {
			setSubmitError(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<div className="fixed inset-0 z-40 bg-black/50" />
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="w-full max-w-md rounded-xl bg-white">
					<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
						<h2 className="text-base font-semibold text-gray-700">Delete Project</h2>
						<button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close delete modal">
							<X size={24} />
						</button>
					</div>

					<div className="px-6 py-5">
						<p className="text-sm text-gray-700">
							Are you sure you want to delete <span className="font-semibold text-gray-900">{project.title}</span>?
						</p>
						<p className="mt-2 text-sm text-gray-500">
							This action cannot be undone.
						</p>
					</div>

					{submitError && (
						<p className="border-t border-rose-100 px-6 py-2 text-sm text-rose-600">
							{submitError}
						</p>
					)}

					<div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
						<button
							onClick={onClose}
							className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							onClick={handleDeleteProject}
							className="flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-rose-700 disabled:opacity-50"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<LoaderCircle className="animate-spin" size={16} />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default DeleteProjectModal
