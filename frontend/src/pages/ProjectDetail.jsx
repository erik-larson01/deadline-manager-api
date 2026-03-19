import { useParams } from 'react-router-dom'

function ProjectDetail() {
  const { id } = useParams()

  return (
    <section>
      <h1>Project Detail</h1>
      <p>Viewing project with id: {id}</p>
      <p>This is an example project description, where a user can set tasks and complete them.</p>
    </section>
  )
}

export default ProjectDetail
