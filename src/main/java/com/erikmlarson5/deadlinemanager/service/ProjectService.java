package com.erikmlarson5.deadlinemanager.service;

import com.erikmlarson5.deadlinemanager.entity.Project;
import com.erikmlarson5.deadlinemanager.entity.Task;
import com.erikmlarson5.deadlinemanager.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Project with ID " + id + " not found"));
    }

    public Project createProject(Project project) {
        float priority = calculatePriority(project);
        project.setPriority(priority);
        return projectRepository.save(project);
    }


    private float calculatePriority(Project project) {
        LocalDate today = LocalDate.now();
        LocalDate dueDate = project.getDueDate();

        // Overdue max priority
        if (dueDate.isBefore(today)) {
            return 10.0f;
        }

        // Calculate days left, capped at 10 days max for urgency scale
        long daysLeft = ChronoUnit.DAYS.between(today, dueDate);
        double urgencyScore = Math.max(0, 10 - Math.min(daysLeft, 10));

        // Weight and difficulty assumed to be 0–10 already, clamp if needed
        double weightScore = Math.min(Math.max(project.getWeight(), 0), 10);
        double difficultyScore = Math.min(Math.max(project.getDifficulty(), 0), 10);

        // Weighted sum
        double priority = urgencyScore * 0.5 + weightScore * 0.3 + difficultyScore * 0.2;

        // Round to 1 decimal place
        return (float) Math.round(priority * 10) / 10f;
    }
}
