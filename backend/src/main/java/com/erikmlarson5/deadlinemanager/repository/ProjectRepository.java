package com.erikmlarson5.deadlinemanager.repository;

import com.erikmlarson5.deadlinemanager.entity.Project;
import com.erikmlarson5.deadlinemanager.utils.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * A JPA repository for all project related functions, connecting to PostgresSQL
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
  Optional<Project> findByProjectIdAndUserId(Long projectId, String userId);

    List<Project> findByUserId(String userId);

    List<Project> findByCategoryIgnoreCaseAndUserId(String category, String userId);

    List<Project> findByStatusAndUserId(Status status, String userId);

    List<Project> findByDueDateBetweenAndUserId(LocalDate start, LocalDate end, String userId);

    List<Project> findAllByUserIdOrderByPriorityDesc(String userId);

    boolean existsByTitleAndUserId(String title, String userId);
}
