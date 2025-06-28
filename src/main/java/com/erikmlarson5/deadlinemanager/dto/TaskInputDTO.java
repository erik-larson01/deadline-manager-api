package com.erikmlarson5.deadlinemanager.dto;

import com.erikmlarson5.deadlinemanager.entity.Project;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class TaskInputDTO {

    @NotBlank(message = "Title must not be blank")
    private String title;

    @NotBlank(message = "Description must not be blank")
    private String description;

    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date cannot be in the past")
    private LocalDate dueDate;

    @DecimalMin(value = "0.0", inclusive = true, message = "Estimated hours must be at least 0")
    @DecimalMax(value = "1000.0", inclusive = true, message = "Estimated hours must not exceed 1000")
    private float estimatedHours;

    @Min(value = 1, message = "Difficulty must be between 1 and 10")
    @Max(value = 10, message = "Difficulty must be between 1 and 10")
    private int difficulty;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Project ID is required")
    private Project project;

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

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}
