package com.erikmlarson5.deadlinemanager.service;

import com.erikmlarson5.deadlinemanager.dto.ProjectInputDTO;
import com.erikmlarson5.deadlinemanager.dto.ProjectOutputDTO;
import com.erikmlarson5.deadlinemanager.entity.Project;
import com.erikmlarson5.deadlinemanager.entity.Task;
import com.erikmlarson5.deadlinemanager.repository.ProjectRepository;
import com.erikmlarson5.deadlinemanager.utils.ProjectMapper;
import com.erikmlarson5.deadlinemanager.utils.Status;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Service layer for all project endpoints which connects to the repository layer
 */
@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;

    /**
     * Project service which connects to the repository layer
     * @param projectRepository injected repository to manage projects
     */
    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * Creates a project and saves to PostgresSQL
     * @param dto the inputDTO of all project fields
     * @return an outputDTO of the saved project
     */
    public ProjectOutputDTO createProject(ProjectInputDTO dto) {
        Project project = ProjectMapper.toEntity(dto);
        if (projectRepository.existsByTitleAndCourse(project.getTitle(), project.getCourse())) {
            throw new IllegalStateException("Project with the same title and course already exists");
        }
        float priority = calculatePriority(project);
        project.setPriority(priority);

        Project savedProject = projectRepository.save(project);
        return ProjectMapper.toOutputDto(savedProject);
    }

    /**
     * Gets a project by its unique id
     * @param id the id of the project
     * @return an outputDTO of the found project
     */
    public ProjectOutputDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project with id: " + id + " not found!"));
        return ProjectMapper.toOutputDto(project);
    }

    /**
     * Gets all projects with a shared course field
     * @param course the name of the course to search by
     * @return a list of all projects in the provided class, converted to outputDTOs
     */
    public List<ProjectOutputDTO> getProjectsInCourse(String course) {
        List<Project> allProjects = projectRepository.findByCourseIgnoreCase(course);
        List<ProjectOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Project project : allProjects) {
            allOutputDTOs.add(ProjectMapper.toOutputDto(project));
        }
        return allOutputDTOs;
    }

    /**
     * Gets a list of all projects
     * @return a list of all projects, converted to outputDTOs
     */
    public List<ProjectOutputDTO> getAllProjects() {
        List<Project> allProjects = projectRepository.findAll();
        List<ProjectOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Project project : allProjects) {
            allOutputDTOs.add(ProjectMapper.toOutputDto(project));
        }
        return allOutputDTOs;
    }

    /**
     * Gets a list of all projects due in X days,
     * @param days the number of days until a given deadline
     * @return a list of all projects due in X days, converted to outputDTOs
     */
    public List<ProjectOutputDTO> getProjectsDueInDays(int days) {
        LocalDate today = LocalDate.now();
        LocalDate deadline = today.plusDays(days);
        List<Project> projects = projectRepository.findByDueDateBetween(today, deadline);

        List<ProjectOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Project project : projects) {
            allOutputDTOs.add(ProjectMapper.toOutputDto(project));
        }
        return allOutputDTOs;
    }

    /**
     * Gets a list of all projects by an enum status
     * @param status the status query to search by
     * @return a list of all projects by specific status, converted to outputDTOs
     */
    public List<ProjectOutputDTO> getProjectsByStatus(Status status) {
        List<Project> allProjects = projectRepository.findByStatus(status);
        List<ProjectOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Project project : allProjects) {
            allOutputDTOs.add(ProjectMapper.toOutputDto(project));
        }
        return allOutputDTOs;
    }

    /**
     * Gets all projects with a status of COMPLETED
     * @return a list of all incomplete tasks in a project, converted to outputDTOs
     */
    public List<ProjectOutputDTO> getCompletedProjects() {
        return getProjectsByStatus(Status.COMPLETED);
    }

    /**
     * Gets all projects in a list, sorted by calculated priority
     * @return a list of projects in priority order, converted to outputDTOs
     */
    public List<ProjectOutputDTO> getProjectsSortedByPriority() {
        List<Project> allProjects = projectRepository.findAllByOrderByPriorityDesc();
        List<ProjectOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Project project : allProjects) {
            allOutputDTOs.add(ProjectMapper.toOutputDto(project));
        }
        return allOutputDTOs;
    }

    /**
     * Fully updates all fields of a project, replacing every value and field including priority
     * and tasks
     * @param id the id of the project to update
     * @param dto an inputDTO object of all fields to replace
     * @return an outputDTO of the updated and saved task
     */
    public ProjectOutputDTO updateProject(Long id, ProjectInputDTO dto) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Project with id " + id + " not found!"));

        existingProject.setTitle(dto.getTitle());
        existingProject.setDescription(dto.getDescription());
        existingProject.setCourse(dto.getCourse());
        existingProject.setDueDate(dto.getDueDate());
        existingProject.setWeight(dto.getWeight());
        existingProject.setDifficulty(dto.getDifficulty());
        existingProject.setStatus(Status.valueOf(dto.getStatus().toUpperCase()));

        float newPriority = calculatePriority(existingProject);
        existingProject.setPriority(newPriority);

        projectRepository.save(existingProject);
        return ProjectMapper.toOutputDto(existingProject);
    }

    /**
     * Updates only a project's enum status
     * @param id the id of the project to update
     * @param newStatus the new status to change to
     * @return an outputDTO of the updated and saved task
     */
    public ProjectOutputDTO updateProjectStatus(Long id, String newStatus) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Project with id " + id + " not " + "found!"));

        project.setStatus(Status.valueOf(newStatus.toUpperCase()));
        projectRepository.save(project);

        return ProjectMapper.toOutputDto(project);
    }

    /**
     * Recalculates all project priorities to account for the current date and time
     */
    public void updateAllProjectPriorities() {
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            float newPriority = calculatePriority(project);
            project.setPriority(newPriority);
        }
        projectRepository.saveAll(projects);
    }

    /**
     * Deletes a project in the database
     * @param id the id of the project to delete
     */
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Project with id: " + id + " not found!"));
        projectRepository.delete(project);
    }

    /**
     * Calculates the priority of a project using 5 different factors
     * @param project the project to calculate priority for
     * @return a priority score from 0-10
     */
    public float calculatePriority(Project project) {
        LocalDate today = LocalDate.now();
        LocalDate dueDate = project.getDueDate();

        // Maximum priority for overdue projects
        if (dueDate.isBefore(today)) {
            return 10.0f;
        }

        long daysLeft = ChronoUnit.DAYS.between(today, dueDate);
        double totalHoursRemaining = calculateRemainingWork(project);

        // Time pressure based on days left
        double timePressureScore = calculateTimePressureScore(daysLeft);

        // Project importance based on grade percentage weight
        double importanceScore = Math.min(Math.max(project.getWeight(), 0), 10);

        // Workload factor based on estimated hours of all tasks
        double workloadScore = calculateWorkloadScore(totalHoursRemaining);

        // Difficulty factor based on user input (0-10)
        double difficultyFactor = Math.min(Math.max(project.getDifficulty(), 0), 10);

        // Progress factor based on completed tasks
        double progressScore = calculateProgressScore(project);

        double baseScore = (timePressureScore * 0.4) +
                (importanceScore * 0.3) +
                (workloadScore * 0.15) +
                (progressScore * 0.15);

        // Adds a multiplier for more difficult projects
        double difficultyMultiplier = 1.0 + (difficultyFactor / 20.0);
        double priority = baseScore * difficultyMultiplier;

        return Math.round(Math.min(priority, 10.0) * 10f) / 10f;
    }

    /**
     * Used to calculate the total estimated hours across all tasks
     * @param project the project to calculate the total for
     * @return the total estimated hours across all tasks, or 5.0 if none
     */
    private double calculateRemainingWork(Project project) {
        if (project.getTasks() == null || project.getTasks().isEmpty()) {
            return 5.0;
        }

        double totalHours = 0.0;
        for (Task task : project.getTasks()) {
            if (task.getStatus() != Status.COMPLETED) {
                totalHours += task.getEstimatedHours();
            }
        }
        return totalHours;
    }

    /**
     * Used to calculate a time pressure score based on urgency
     * @param daysLeft the number of days until a project's deadline
     * @return a score based on estimated time pressure
     */
    private double calculateTimePressureScore(long daysLeft) {
        if (daysLeft <= 0) {
            return 10.0;
        }

        // Exponential time pressure (higher pressure the closer the deadline)
        if (daysLeft >= 14) {
            return 1.0;
        } else if (daysLeft >= 7) {
            return 2.0 + ((14 - daysLeft) / 7.0) * 3.0;
        } else if (daysLeft >= 3) {
            return 5.0 + ((7 - daysLeft) / 4.0) * 3.0;
        } else {
            return 8.0 + ((3 - daysLeft) / 3.0) * 2.0;
        }
    }

    /**
     * Used to calculate a workload score based on estimated hours left in a project
     * @param hoursRemaining estimated hours left in a given project
     * @return a score based on estimated workload
     */
    private double calculateWorkloadScore(double hoursRemaining) {
        if (hoursRemaining <= 0) {
            return 1.0; // Completed work
        }

        // Logarithmic workload scaling
        if (hoursRemaining <= 2) {
            return 2.0 + hoursRemaining;
        } else if (hoursRemaining <= 8) {
            return 4.0 + ((hoursRemaining - 2) / 6.0) * 3.0;
        } else if (hoursRemaining <= 20) {
            return 7.0 + ((hoursRemaining - 8) / 12.0) * 2.0;
        } else {
            return 9.0 + Math.min(1.0, (hoursRemaining - 20) / 20.0);
        }
    }

    /**
     * Calculates a progress score based on the number of completed tasks, or 5.0 if none
     * @param project the project to calculate the score for
     * @return a score based on estimated progress
     */
    private double calculateProgressScore(Project project) {
        List<Task> allTasks = project.getTasks();
        if (allTasks.isEmpty()) {
            // Neutral progress score for projects without tasks, if any
            return 5.0;
        }

        int completedTasks = 0;
        for (Task task : allTasks) {
            if (task.getStatus() == Status.COMPLETED) {
                completedTasks++;
            }
        }

        double completionPercentage = (double) completedTasks / allTasks.size();

        // Progress score is the inverse of completion percentage
        return (1.0 - completionPercentage) * 10.0;
    }
}

