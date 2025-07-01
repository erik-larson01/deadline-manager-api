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

@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

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

    public ProjectOutputDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project with id: " + id + " not found!"));
        return ProjectMapper.toOutputDto(project);
    }

    public List<ProjectOutputDTO> getProjectsInCourse(String course) {
        List<Project> allProjects = projectRepository.findByCourseIgnoreCase(course);
        List<ProjectOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Project project : allProjects) {
            allOutputDTOs.add(ProjectMapper.toOutputDto(project));
        }
        return allOutputDTOs;
    }

    public List<ProjectOutputDTO> getAllProjects() {
        List<Project> allProjects = projectRepository.findAll();
        List<ProjectOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Project project : allProjects) {
            allOutputDTOs.add(ProjectMapper.toOutputDto(project));
        }
        return allOutputDTOs;
    }

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
    public List<ProjectOutputDTO> getProjectsByStatus(Status status) {
        List<Project> allProjects = projectRepository.findByStatus(status);
        List<ProjectOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Project project : allProjects) {
            allOutputDTOs.add(ProjectMapper.toOutputDto(project));
        }
        return allOutputDTOs;
    }

    public List<ProjectOutputDTO> getCompletedProjects() {
        return getProjectsByStatus(Status.COMPLETED);
    }

    public List<ProjectOutputDTO> getProjectsSortedByPriority() {
        List<Project> allProjects = projectRepository.findAllByOrderByPriorityDesc();
        List<ProjectOutputDTO> allOutputDTOs = new ArrayList<>();
        for (Project project : allProjects) {
            allOutputDTOs.add(ProjectMapper.toOutputDto(project));
        }
        return allOutputDTOs;
    }

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

    public ProjectOutputDTO updateProjectStatus(Long id, String newStatus) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Project with id " + id + " not " + "found!"));

        project.setStatus(Status.valueOf(newStatus.toUpperCase()));
        projectRepository.save(project);

        return ProjectMapper.toOutputDto(project);
    }

    public void updateAllProjectPriorities() {
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            float newPriority = calculatePriority(project);
            project.setPriority(newPriority);
        }
        projectRepository.saveAll(projects);
    }

    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Project with id: " + id + " not found!"));
        projectRepository.delete(project);
    }

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

