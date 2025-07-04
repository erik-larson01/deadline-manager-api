package com.erikmlarson5.deadlinemanager.repository;

import com.erikmlarson5.deadlinemanager.entity.Project;
import com.erikmlarson5.deadlinemanager.utils.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * A JPA repository for all project related functions, connecting to PostgresSQL
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(Status status);

    List<Project> findAllByOrderByPriorityDesc();

    boolean existsByTitleAndCourse(String title, String course);

    List<Project> findByCourseIgnoreCase(String course);

    List<Project> findByDueDateBetween(LocalDate start, LocalDate end);
}
