package com.erikmlarson5.deadlinemanager.repository;

import com.erikmlarson5.deadlinemanager.entity.Project;
import com.erikmlarson5.deadlinemanager.entity.Task;
import com.erikmlarson5.deadlinemanager.utils.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(Status status);

    List<Task> findByProject_ProjectId(Long projectId);

    List<Task> findAllByOrderByPriorityDesc();
}
