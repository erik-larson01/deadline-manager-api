package com.erikmlarson5.deadlinemanager.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * A DTO which validates all fields of an incoming Project
 */
public class ProjectInputDTO {

    @NotBlank(message = "Title must not be blank")
    private String title;

    private String description;

    private String category;

    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date cannot be in the past")
    private LocalDate dueDate;

    @DecimalMin(value = "0.0", inclusive = true, message = "Estimated hours must be >= 0")
    private Float estimatedHours;

    @Min(value = 1, message = "Difficulty must be between 1 and 10")
    @Max(value = 10, message = "Difficulty must be between 1 and 10")
    private Integer difficulty;

    @NotBlank(message = "Status is required")
    private String status;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Float getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Float estimatedHours) { this.estimatedHours = estimatedHours; }

    public Integer getDifficulty() { return difficulty; }
    public void setDifficulty(Integer difficulty) { this.difficulty = difficulty; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
