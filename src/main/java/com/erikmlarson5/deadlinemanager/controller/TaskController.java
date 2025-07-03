package com.erikmlarson5.deadlinemanager.controller;

import com.erikmlarson5.deadlinemanager.dto.ProjectOutputDTO;
import com.erikmlarson5.deadlinemanager.dto.TaskInputDTO;
import com.erikmlarson5.deadlinemanager.dto.TaskOutputDTO;
import com.erikmlarson5.deadlinemanager.service.TaskService;
import com.erikmlarson5.deadlinemanager.utils.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1")
public class TaskController {
    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping(path = "projects/{projectId}/tasks")
    public ResponseEntity<TaskOutputDTO> createTask(@PathVariable Long projectId,
                                                    @RequestBody TaskInputDTO dto) {
        TaskOutputDTO createdTask = taskService.createTask(projectId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping(path = "projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<TaskOutputDTO> getTaskById(@PathVariable Long projectId,
                                                     @PathVariable Long taskId) {
        TaskOutputDTO task = taskService.getTaskById(projectId, taskId);
        return ResponseEntity.ok(task);
    }

    @GetMapping(path = "/tasks")
    public ResponseEntity<List<TaskOutputDTO>> getAllTasks() {
        List<TaskOutputDTO> allTasks = taskService.getAllTasks();
        return ResponseEntity.ok(allTasks);
    }

    @GetMapping(path = "/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskOutputDTO>> getTasksInProject(@PathVariable Long projectId) {
        List<TaskOutputDTO> allTasksInProject = taskService.getTasksInProject(projectId);
        return ResponseEntity.ok(allTasksInProject);
    }

    @GetMapping(path = "/tasks/status")
    public ResponseEntity<List<TaskOutputDTO>> getAllTasksByStatus(@RequestParam Status status) {
        List<TaskOutputDTO> tasksByStatus = taskService.getAllTasksByStatus(status);
        return ResponseEntity.ok(tasksByStatus);
    }

    @GetMapping(path = "/projects/{projectId}/tasks/incomplete")
    public ResponseEntity<List<TaskOutputDTO>> getIncompleteTasksInProject(@PathVariable Long projectId) {
        List<TaskOutputDTO> incompleteTasks = taskService.getIncompleteTasksInProject(projectId);
        return ResponseEntity.ok(incompleteTasks);
    }

    @PutMapping(path = "/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<TaskOutputDTO> updateTask(@PathVariable Long projectId,
                                                    @PathVariable Long taskId,
                                                    @RequestBody TaskInputDTO dto) {
        TaskOutputDTO updatedTask = taskService.updateTask(projectId, taskId, dto);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping(path = "/projects/{projectId}/tasks/{taskId}/status")
    public ResponseEntity<TaskOutputDTO> updateTaskStatus(@PathVariable Long projectId,
                                                          @PathVariable Long taskId,
                                                          @RequestParam String newStatus) {
        TaskOutputDTO updatedTask = taskService.updateTaskStatus(projectId, taskId, newStatus);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long projectId,
                                           @PathVariable Long taskId) {
        taskService.deleteTask(projectId, taskId);
        return ResponseEntity.noContent().build();
    }
}
