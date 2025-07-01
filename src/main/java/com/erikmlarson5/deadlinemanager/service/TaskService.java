package com.erikmlarson5.deadlinemanager.service;

import com.erikmlarson5.deadlinemanager.dto.TaskInputDTO;
import com.erikmlarson5.deadlinemanager.dto.TaskOutputDTO;
import com.erikmlarson5.deadlinemanager.entity.Project;
import com.erikmlarson5.deadlinemanager.entity.Task;
import com.erikmlarson5.deadlinemanager.repository.ProjectRepository;
import com.erikmlarson5.deadlinemanager.repository.TaskRepository;
import com.erikmlarson5.deadlinemanager.utils.Status;
import com.erikmlarson5.deadlinemanager.utils.TaskMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;

    @Autowired
    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository,
                       ProjectService projectService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.projectService = projectService;
    }

    public TaskOutputDTO createTask(Long projectId, TaskInputDTO dto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project with id: " + projectId + " not " + "found!"));

        Task task = TaskMapper.toEntity(dto, project);

        if (project.getTasks() == null) {
            project.setTasks(new ArrayList<>());
        }
        project.getTasks().add(task);

        float newPriority = projectService.calculatePriority(project);
        project.setPriority(newPriority);
        projectRepository.save(project);

        Task savedTask = taskRepository.save(task);
        return TaskMapper.toOutputDto(savedTask);
    }

    public TaskOutputDTO getTaskById(Long projectId, Long taskId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project with id: " + projectId + " not " + "found!"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getProject().getProjectId().equals(projectId)) {
            throw new IllegalArgumentException("Task does not belong to this project");
        }

        return TaskMapper.toOutputDto(task);
    }

    public List<TaskOutputDTO> getAllTasks() {
        List<Task> allTasks = taskRepository.findAll();
        List<TaskOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Task task : allTasks) {
            allOutputDTOs.add(TaskMapper.toOutputDto(task));
        }
        return allOutputDTOs;
    }

    public List<TaskOutputDTO> getAllTasksByStatus(Status status) {
        List<Task> allTasks = taskRepository.findByStatus(status);
        List<TaskOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Task task : allTasks) {
            allOutputDTOs.add(TaskMapper.toOutputDto(task));
        }
        return allOutputDTOs;
    }

    public List<TaskOutputDTO> getTasksInProject(Long projectId) {
        List<Task> allTasks = taskRepository.findByProject_ProjectId(projectId);
        List<TaskOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Task task : allTasks) {
            allOutputDTOs.add(TaskMapper.toOutputDto(task));
        }
        return allOutputDTOs;
    }


    public List<TaskOutputDTO> getTasksInProjectByPriority(Long projectId) {
        List<Task> allTasks = taskRepository.findByProject_ProjectIdOrderByPriorityDesc(projectId);
        List<TaskOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Task task : allTasks) {
            allOutputDTOs.add(TaskMapper.toOutputDto(task));
        }
        return allOutputDTOs;
    }

    public List<TaskOutputDTO> getIncompleteTasksInProject(Long projectId) {
        List<Task> allTasks = taskRepository.findByProject_ProjectId(projectId);
        List<TaskOutputDTO> incompleteTasks = new ArrayList<>();

        for (Task task : allTasks) {
            if (task.getStatus() != Status.COMPLETED) {
                incompleteTasks.add(TaskMapper.toOutputDto(task));
            }
        }

        return incompleteTasks;
    }
    public TaskOutputDTO updateTask(Long projectId, Long taskId, TaskInputDTO dto) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new NoSuchElementException("Task with id " + taskId + " not " +
                        "found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Project with id " + projectId + " not " +
                        "found!"));

        existingTask.setTitle(dto.getTitle());
        existingTask.setDescription(dto.getDescription());
        existingTask.setDueDate(dto.getDueDate());
        existingTask.setEstimatedHours(dto.getEstimatedHours());
        existingTask.setDifficulty(dto.getDifficulty());
        existingTask.setStatus(Status.valueOf(dto.getStatus().toUpperCase()));
        existingTask.setProject(project);

        float newPriority = projectService.calculatePriority(project);
        project.setPriority(newPriority);
        projectRepository.save(project);

        Task updatedTask = taskRepository.save(existingTask);
        return TaskMapper.toOutputDto(updatedTask);
    }

    public TaskOutputDTO updateTaskStatus(Long projectId, Long taskId, String newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NoSuchElementException("Task with id " + taskId + " not found!"));

        if (!task.getProject().getProjectId().equals(projectId)) {
            throw new IllegalArgumentException("Task does not belong to project with id " + projectId);
        }

        task.setStatus(Status.valueOf(newStatus.toUpperCase()));
        taskRepository.save(task);

        return TaskMapper.toOutputDto(task);
    }

    public void deleteTask(Long projectId, Long taskId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Project with id " + projectId + " not " +
                        "found!"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NoSuchElementException("Task with id " + taskId + " not found!"));

        if (!task.getProject().getProjectId().equals(projectId)) {
            throw new IllegalArgumentException("Task does not belong to project with id " + projectId);
        }

        float newPriority = projectService.calculatePriority(project);
        project.setPriority(newPriority);
        projectRepository.save(project);

        taskRepository.delete(task);
    }
}
