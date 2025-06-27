package com.erikmlarson5.deadlinemanager.dto;

import com.erikmlarson5.deadlinemanager.entity.Task;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProjectOutputDTO {

    private Long projectId;
    private String title;
    private String description;
    private String course;
    private LocalDate dueDate;
    private float weight;
    private int difficulty;
    private String status;
    private float priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TaskOutputDTO> tasks = new ArrayList<>();;

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public float getWeight() { return weight; }
    public void setWeight(float weight) { this.weight = weight; }

    public int getDifficulty() { return difficulty; }
    public void setDifficulty(int difficulty) { this.difficulty = difficulty; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public float getPriority() { return priority; }
    public void setPriority(float priority) { this.priority = priority; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }


    public List<TaskOutputDTO> getTasks() { return tasks; }
    public void setTasks(ArrayList<TaskOutputDTO> tasks) { this.tasks = tasks; }
}
