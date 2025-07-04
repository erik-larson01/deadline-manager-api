package com.erikmlarson5.deadlinemanager.dto;

import com.erikmlarson5.deadlinemanager.entity.Project;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * A DTO for Tasks which is returned to the user in a ResponseEntity
 */
public class TaskOutputDTO {

    private Long taskId;
    private String title;
    private String description;
    private LocalDate dueDate;
    private float estimatedHours;
    private int difficulty;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long projectId;

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public float getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(float estimatedHours) { this.estimatedHours = estimatedHours; }

    public int getDifficulty() { return difficulty; }
    public void setDifficulty(int difficulty) { this.difficulty = difficulty; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
}
