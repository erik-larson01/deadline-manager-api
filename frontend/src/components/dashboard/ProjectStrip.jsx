import ProjectStripRow from './ProjectStripRow'

function ProjectsStrip({ activeProjects }) {
	return (
		<section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<h2 className="mb-3 text-base font-semibold text-gray-900">Projects</h2>

      {/** Show message if no active projects, otherwise list them */}
			{activeProjects.length === 0 ? (
				<p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-sm text-gray-600">
					No active projects right now.
				</p>
			) : (
				<div>
					{activeProjects.map((project) => (
						<ProjectStripRow key={project.projectId} project={project} />
					))}
				</div>
			)}
		</section>
	)
}

export default ProjectsStrip
