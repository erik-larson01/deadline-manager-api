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

/**
 * Service layer for all task endpoints which connects to the repository layer
 */
@Service
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;

    /**
     * Task service which connects to the repository layer
     * @param taskRepository injected repository to manage tasks
     * @param projectRepository injected repository for priority recalculation
     * @param projectService injected service for priority recalculation
     */
    @Autowired
    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository,
                       ProjectService projectService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.projectService = projectService;
    }

    /**
     * Creates a task and saves to PostgresSQL
     * @param projectId the id of the associated project
     * @param dto the inputDTO of all task fields
     * @return an outputDTO of the saved task
     */
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

    /**
     * Gets a task by its unique id
     * @param projectId the id of the associated project
     * @param taskId the id of the task to be found
     * @return an outputDTO of the found task
     */
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

    /**
     * Gets a list of all tasks across all projects
     * @return a list of all tasks, converted to outputDTOs
     */
    public List<TaskOutputDTO> getAllTasks() {
        List<Task> allTasks = taskRepository.findAll();
        List<TaskOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Task task : allTasks) {
            allOutputDTOs.add(TaskMapper.toOutputDto(task));
        }
        return allOutputDTOs;
    }

    /**
     * Gets a list of all tasks by an enum status
     * @param status the status query to search by
     * @return a list of all tasks by specific status, converted to outputDTOs
     */
    public List<TaskOutputDTO> getAllTasksByStatus(Status status) {
        List<Task> allTasks = taskRepository.findByStatus(status);
        List<TaskOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Task task : allTasks) {
            allOutputDTOs.add(TaskMapper.toOutputDto(task));
        }
        return allOutputDTOs;
    }

    /**
     * Gets a list of all tasks within a specific project
     * @param projectId the project to get all tasks from
     * @return a list of all tasks in a project, converted to outputDTOs
     */
    public List<TaskOutputDTO> getTasksInProject(Long projectId) {
        List<Task> allTasks = taskRepository.findByProject_ProjectId(projectId);
        List<TaskOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Task task : allTasks) {
            allOutputDTOs.add(TaskMapper.toOutputDto(task));
        }
        return allOutputDTOs;
    }

    /**
     * A more specific search by status query, getting all incomplete tasks in a project
     * @param projectId the project to get all incomplete tasks from
     * @return a list of all incomplete tasks in a project, converted to outputDTOs
     */
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

    /**
     * Fully updates all fields of a task, replacing every value and field including priority
     * @param projectId the id of the associated project
     * @param taskId the id of the task to update
     * @param dto an inputDTO object of all fields to replace
     * @return an outputDTO of the updated and saved task
     */
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

    /**
     * Updates only a task's enum status
     * @param projectId the id of the associated project
     * @param taskId the id of the task to update
     * @param newStatus the new status to change to
     * @return an outputDTO of the updated and saved task
     */
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

    /**
     * Deletes a task in the database
     * @param projectId the id of the associated project
     * @param taskId the id of the task to delete
     */
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
