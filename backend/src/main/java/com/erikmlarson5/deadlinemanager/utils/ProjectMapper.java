package com.erikmlarson5.deadlinemanager.utils;

import com.erikmlarson5.deadlinemanager.dto.ProjectInputDTO;
import com.erikmlarson5.deadlinemanager.dto.ProjectOutputDTO;
import com.erikmlarson5.deadlinemanager.dto.TaskOutputDTO;
import com.erikmlarson5.deadlinemanager.entity.Project;
import com.erikmlarson5.deadlinemanager.entity.Task;

import java.util.ArrayList;
import java.util.List;

/**
 * Mapper methods for clean Project DTO conversions
 */
public class ProjectMapper {

    /**
     * Maps an input DTO to a Postgres database entity
     * @param dto the input DTO
     * @return the DTO in entity form
     */
    public static Project toEntity(ProjectInputDTO dto) {
        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setCourse(dto.getCourse());
        project.setDueDate(dto.getDueDate());
        project.setWeight(dto.getWeight());
        project.setDifficulty(dto.getDifficulty());
        project.setStatus(Status.valueOf(dto.getStatus()));
        return project;
    }

    /**
     * Maps a database entity to an output DTO
     * @param project the project entity to be converted
     * @return the entity in outputDTO form
     */
    public static ProjectOutputDTO toOutputDto(Project project) {
        ProjectOutputDTO dto = new ProjectOutputDTO();
        dto.setProjectId(project.getProjectId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setCourse(project.getCourse());
        dto.setDueDate(project.getDueDate());
        dto.setWeight(project.getWeight());
        dto.setDifficulty(project.getDifficulty());
        dto.setStatus(project.getStatus().name());
        dto.setPriority(project.getPriority());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        if (project.getTasks() != null) {
            List<TaskOutputDTO> taskDtos = new ArrayList<>();
            for (Task task : project.getTasks()) {
                TaskOutputDTO taskDto = TaskMapper.toOutputDto(task);
                taskDtos.add(taskDto);
            }
            dto.setTasks(taskDtos);
        }
        return dto;
    }
}
