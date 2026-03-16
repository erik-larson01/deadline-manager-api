package com.erikmlarson5.deadlinemanager.controller;

import com.erikmlarson5.deadlinemanager.dto.ProjectInputDTO;
import com.erikmlarson5.deadlinemanager.dto.ProjectOutputDTO;
import com.erikmlarson5.deadlinemanager.service.ProjectService;
import com.erikmlarson5.deadlinemanager.utils.Status;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * A controller which sets all project related endpoints and connects to the service logic layer
 */
@Validated
@RestController
@RequestMapping(path = "/api/v1/projects")
public class ProjectController {
    private final ProjectService projectService;

    /**
     * Project controller which connects to the service layer
     * @param projectService the injected service to connect to
     */
    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * Creates an endpoint to save a new project to PostgresSQL
     * @param dto the inputDTO object to convert and save
     * @return a response entity containing the created project
     */
    @PostMapping
    public ResponseEntity<ProjectOutputDTO> createProject(@RequestBody @Valid ProjectInputDTO dto) {
        ProjectOutputDTO createdProject = projectService.createProject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    /**
     * Creates an endpoint to get a project by its unique id
     * @param id the id of the project to get
     * @return a response entity containing the found project
     */
    @GetMapping(path = "/{id}")
    public ResponseEntity<ProjectOutputDTO> getProjectById(@PathVariable Long id) {
        ProjectOutputDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    /**
     * Creates an endpoint to get all projects
     * @return a response entity containing all projects
     */
    @GetMapping
    public ResponseEntity<List<ProjectOutputDTO>> getAllProjects() {
        List<ProjectOutputDTO> allProjects = projectService.getAllProjects();
        return ResponseEntity.ok(allProjects);
    }

    /**
     * Creates an endpoint to get all projects by a given course
     * @param course the course to search by
     * @return a response entity containing the found projects
     */
    @GetMapping(path = "/course/{course}")
    public ResponseEntity<List<ProjectOutputDTO>> getProjectsByCourse(@PathVariable String course) {
        List<ProjectOutputDTO> courseProjects = projectService.getProjectsInCourse(course);
        return ResponseEntity.ok(courseProjects);
    }

    /**
     * Creates an endpoint to get all projects by an enum status
     * @param status the enum status to search by
     * @return a response entity containing the found projects
     */
    @GetMapping(path = "/status")
    public ResponseEntity<List<ProjectOutputDTO>> getProjectsByStatus(@RequestParam @Valid Status status) {
        List<ProjectOutputDTO> projectsByStatus = projectService.getProjectsByStatus(status);
        return ResponseEntity.ok(projectsByStatus);
    }

    /**
     * Creates an endpoint to get all projects due in X days
     * @param days the number of days until a given deadline
     * @return a response entity containing the found projects
     */
    @GetMapping(path = "/due-in")
    public ResponseEntity<List<ProjectOutputDTO>> getProjectsDueInDays(@RequestParam @Valid int days) {
        List<ProjectOutputDTO> projectsDueIn = projectService.getProjectsDueInDays(days);
        return ResponseEntity.ok(projectsDueIn);
    }

    /**
     * Creates an endpoint to get all completed projects
     * @return a response entity containing the found projects
     */
    @GetMapping(path = "/completed")
    public ResponseEntity<List<ProjectOutputDTO>> getCompletedProjects() {
        List<ProjectOutputDTO> completedProjects = projectService.getCompletedProjects();
        return ResponseEntity.ok(completedProjects);
    }

    /**
     * Creates an endpoint to get all project sorted by priority
     * @return a response entity containing the found projects, sorted by priority descending
     */
    @GetMapping(path = "/priority")
    public ResponseEntity<List<ProjectOutputDTO>> getProjectsSortedByPriority() {
        List<ProjectOutputDTO> sortedProjects = projectService.getProjectsSortedByPriority();
        return ResponseEntity.ok(sortedProjects);
    }

    /**
     * Creates an endpoint to update a specific project
     * @param id the id of the project to be updated
     * @param dto the new inputDTO to be saved
     * @return a response entity of the updated project
     */
    @PutMapping(path = "/{id}")
    public ResponseEntity<ProjectOutputDTO> updateProject(@PathVariable Long id,
                                                          @RequestBody @Valid ProjectInputDTO dto) {
        ProjectOutputDTO updatedProject = projectService.updateProject(id, dto);
        return ResponseEntity.ok(updatedProject);
    }

    /**
     * Creates an endpoint to update a specific project's status field
     * @param id the id of the project to be updated
     * @param newStatus the new enum status to be saved
     * @return a response entity of the updated project
     */
    @PatchMapping(path = "/{id}/status")
    public ResponseEntity<ProjectOutputDTO> updateProjectStatus(@PathVariable Long id,
                                                                @RequestParam @Valid String newStatus) {
        ProjectOutputDTO updatedProject = projectService.updateProjectStatus(id, newStatus);
        return ResponseEntity.ok(updatedProject);
    }

    /**
     * Creates an endpoint to update the priority of all projects
     * @return a response entity that displays the successful update
     */
    @PatchMapping(path = "/update-priorities")
    public ResponseEntity<Void> updateAllProjectPriorities() {
        projectService.updateAllProjectPriorities();
        return ResponseEntity.noContent().build();
    }

    /**
     * Creates an endpoint to delete a specific project
     * @param id the id of the project to be deleted
     * @return a response entity that displays the successful deletion
     */
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
