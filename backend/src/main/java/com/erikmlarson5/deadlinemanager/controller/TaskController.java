package com.erikmlarson5.deadlinemanager.controller;

import com.erikmlarson5.deadlinemanager.dto.ProjectOutputDTO;
import com.erikmlarson5.deadlinemanager.dto.TaskInputDTO;
import com.erikmlarson5.deadlinemanager.dto.TaskOutputDTO;
import com.erikmlarson5.deadlinemanager.service.TaskService;
import com.erikmlarson5.deadlinemanager.utils.Status;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * A controller which sets all task related endpoints and connects to the service logic layer
 */
@Validated
@RestController
@RequestMapping(path = "/api/v1")
public class TaskController {
    private final TaskService taskService;

    /**
     * Task controller which connects to the service layer
     * @param taskService the injected service to connect to
     */
    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Creates an endpoint to save a new task to PostgresSQL
     * @param projectId the id of the associated project
     * @param dto the inputDTO object to convert and save
     * @return a response entity containing the created task
     */
    @PostMapping(path = "projects/{projectId}/tasks")
    public ResponseEntity<TaskOutputDTO> createTask(@PathVariable Long projectId,
                                                    @RequestBody @Valid TaskInputDTO dto) {
        TaskOutputDTO createdTask = taskService.createTask(projectId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    /**
     * Creates an endpoint to get a task by its unique id
     * @param projectId the id of the associated project
     * @param taskId the id of the task to get
     * @return a response entity containing the found task
     */
    @GetMapping(path = "projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<TaskOutputDTO> getTaskById(@PathVariable Long projectId,
                                                     @PathVariable Long taskId) {
        TaskOutputDTO task = taskService.getTaskById(projectId, taskId);
        return ResponseEntity.ok(task);
    }

    /**
     * Creates an endpoint to get all tasks
     * @return a response entity containing all tasks
     */
    @GetMapping(path = "/tasks")
    public ResponseEntity<List<TaskOutputDTO>> getAllTasks() {
        List<TaskOutputDTO> allTasks = taskService.getAllTasks();
        return ResponseEntity.ok(allTasks);
    }

    /**
     * Creates an endpoint to get all tasks in a given project
     * @param projectId the id of the associated project
     * @return a response entity containing the found tasks
     */
    @GetMapping(path = "/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskOutputDTO>> getTasksInProject(@PathVariable Long projectId) {
        List<TaskOutputDTO> allTasksInProject = taskService.getTasksInProject(projectId);
        return ResponseEntity.ok(allTasksInProject);
    }

    /**
     * Creates an endpoint to get all tasks by an enum status
     * @param status the enum status to search by
     * @return a response entity containing the found tasks
     */
    @GetMapping(path = "/tasks/status")
    public ResponseEntity<List<TaskOutputDTO>> getAllTasksByStatus(@RequestParam @Valid Status status) {
        List<TaskOutputDTO> tasksByStatus = taskService.getAllTasksByStatus(status);
        return ResponseEntity.ok(tasksByStatus);
    }

    /**
     * Creates an endpoint to get all incomplete tasks in a given project
     * @param projectId the id of the associated project
     * @return a response entity containing the found tasks
     */
    @GetMapping(path = "/projects/{projectId}/tasks/incomplete")
    public ResponseEntity<List<TaskOutputDTO>> getIncompleteTasksInProject(@PathVariable Long projectId) {
        List<TaskOutputDTO> incompleteTasks = taskService.getIncompleteTasksInProject(projectId);
        return ResponseEntity.ok(incompleteTasks);
    }

    /**
     * Creates an endpoint to update a specific task
     * @param projectId the id of the associated project
     * @param taskId the id of the task to update
     * @param dto the new inputDTO to be saved
     * @return a response entity of the updated task
     */
    @PutMapping(path = "/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<TaskOutputDTO> updateTask(@PathVariable Long projectId,
                                                    @PathVariable Long taskId,
                                                    @RequestBody @Valid TaskInputDTO dto) {
        TaskOutputDTO updatedTask = taskService.updateTask(projectId, taskId, dto);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * Creates an endpoint to update a specific task's status field
     * @param projectId the id of the associated project
     * @param taskId the id of the task to update
     * @param newStatus the new enum status to be saved
     * @return a response entity of the updated task
     */
    @PatchMapping(path = "/projects/{projectId}/tasks/{taskId}/status")
    public ResponseEntity<TaskOutputDTO> updateTaskStatus(@PathVariable Long projectId,
                                                          @PathVariable Long taskId,
                                                          @RequestParam @Valid String newStatus) {
        TaskOutputDTO updatedTask = taskService.updateTaskStatus(projectId, taskId, newStatus);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * Creates an endpoint to delete a specific project
     * @param projectId the id of the associated project
     * @param taskId the id of the task to update
     * @return a response entity of the updated task
     */
    @DeleteMapping("/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long projectId,
                                           @PathVariable Long taskId) {
        taskService.deleteTask(projectId, taskId);
        return ResponseEntity.noContent().build();
    }
}
