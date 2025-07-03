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

@Validated
@RestController
@RequestMapping(path = "/api/v1/projects")
public class ProjectController {
    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectOutputDTO> createProject(@RequestBody @Valid ProjectInputDTO dto) {
        ProjectOutputDTO createdProject = projectService.createProject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<ProjectOutputDTO> getProjectById(@PathVariable Long id) {
        ProjectOutputDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public ResponseEntity<List<ProjectOutputDTO>> getAllProjects() {
        List<ProjectOutputDTO> allProjects = projectService.getAllProjects();
        return ResponseEntity.ok(allProjects);
    }

    @GetMapping(path = "/course/{course}")
    public ResponseEntity<List<ProjectOutputDTO>> getProjectsDueInDays(@PathVariable String course) {
        List<ProjectOutputDTO> courseProjects = projectService.getProjectsInCourse(course);
        return ResponseEntity.ok(courseProjects);
    }

    @GetMapping(path = "/status")
    public ResponseEntity<List<ProjectOutputDTO>> getProjectsByStatus(@RequestParam @Valid Status status) {
        List<ProjectOutputDTO> projectsByStatus = projectService.getProjectsByStatus(status);
        return ResponseEntity.ok(projectsByStatus);
    }

    @GetMapping(path = "/due-in")
    public ResponseEntity<List<ProjectOutputDTO>> getProjectsDueInDays(@RequestParam @Valid int days) {
        List<ProjectOutputDTO> projectsDueIn = projectService.getProjectsDueInDays(days);
        return ResponseEntity.ok(projectsDueIn);
    }

    @GetMapping(path = "/completed")
    public ResponseEntity<List<ProjectOutputDTO>> getCompletedProjects() {
        List<ProjectOutputDTO> completedProjects = projectService.getCompletedProjects();
        return ResponseEntity.ok(completedProjects);
    }

    @GetMapping(path = "/priority")
    public ResponseEntity<List<ProjectOutputDTO>> getProjectsSortedByPriority() {
        List<ProjectOutputDTO> sortedProjects = projectService.getProjectsSortedByPriority();
        return ResponseEntity.ok(sortedProjects);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<ProjectOutputDTO> updateProject(@PathVariable Long id,
                                                          @RequestBody @Valid ProjectInputDTO dto) {
        ProjectOutputDTO updatedProject = projectService.updateProject(id, dto);
        return ResponseEntity.ok(updatedProject);
    }

    @PatchMapping(path = "/{id}/status")
    public ResponseEntity<ProjectOutputDTO> updateProjectStatus(@PathVariable Long id,
                                                                @RequestParam @Valid String newStatus) {
        ProjectOutputDTO updatedProject = projectService.updateProjectStatus(id, newStatus);
        return ResponseEntity.ok(updatedProject);
    }

    @PatchMapping(path = "/update-priorities")
    public ResponseEntity<Void> updateAllProjectPriorities() {
        projectService.updateAllProjectPriorities();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
