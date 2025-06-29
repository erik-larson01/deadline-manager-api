package com.erikmlarson5.deadlinemanager.utils;

import com.erikmlarson5.deadlinemanager.dto.TaskInputDTO;
import com.erikmlarson5.deadlinemanager.dto.TaskOutputDTO;
import com.erikmlarson5.deadlinemanager.entity.Project;
import com.erikmlarson5.deadlinemanager.entity.Task;

public class TaskMapper {
    public static Task toEntity(TaskInputDTO dto, Project project) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setEstimatedHours(dto.getEstimatedHours());
        task.setDifficulty(dto.getDifficulty());
        task.setStatus(Status.valueOf(dto.getStatus().toUpperCase()));
        task.setProject(project);
        return task;
    }

    public static TaskOutputDTO toOutputDto(Task task) {
        TaskOutputDTO dto = new TaskOutputDTO();
        dto.setTaskId(task.getTaskId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setEstimatedHours(task.getEstimatedHours());
        dto.setDifficulty(task.getDifficulty());
        dto.setStatus(task.getStatus().toString());
        dto.setPriority(task.getPriority());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        dto.setProjectId(task.getProject().getProjectId());
        return dto;
    }
}
