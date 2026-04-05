import { createContext } from "react";

const ProjectsContext = createContext({
	projects: [],
	setProjects: () => {},
	isLoading: true,
	error: null,
})

export default ProjectsContext