# Deadline Manager API

[![Java](https://img.shields.io/badge/Java-17-blue)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.3-green)](https://spring.io/projects/spring-boot)
![Last Commit](https://img.shields.io/github/last-commit/erik-larson01/deadline-manager-api/main)

Deadline Manager is a RESTful API and backend system built with Java, Spring Boot, Spring Data JPA, and PostgreSQL, designed to help students and professionals efficiently manage both academic and personal deadlines. 

At its core, the application enables users to define high-level projects and decompose them into smaller, actionable tasks with their own due dates, estimated effort, and difficulty ratings.

By offering structured support for both project-level planning and task-level execution, this API encourages users to focus on what matters most and stay organized under time pressure.

## Motivation
This project began with a question I asked myself during my programming coursework at UW–Madison:
*“I’ve been learning Java, but how can I apply it to build something meaningful and relevant outside the classroom?”*

That question led me to explore real-world backend development using Spring Boot, a powerful Java framework for building scalable APIs and web applications. I wanted to create something technically challenging that also addressed a problem students often face: managing complex academic workloads.

After considering several ideas, I decided to build an API that helps students manage project deadlines more effectively. The goal was to design a tool that could organize high-level projects while breaking them down into smaller, manageable tasks. In my own experience, this kind of structure improves productivity, reduces procrastination, and makes it easier to maintain momentum throughout the semester.

I'm proud of what this project has become and look forward to expanding it into a full application with a user-friendly frontend in the future.

## Features

- Create, read, update, and delete (CRUD) operations for both Projects and Tasks.

- Automatic priority scoring algorithm for projects based on due date, difficulty, and weight.

- Task status management with enum-based validation.

- Filtering and querying projects and tasks by status, due dates, and priorities.

- Consistent global exception handling with meaningful HTTP responses.

- Clean layered architecture separating controller, service, and repository layers.

## Tech Stack

- Java 17
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Jakarta Validation

### API Endpoints

| HTTP Method | Endpoint | Description |
| --- | --- | --- |
| **POST** | `/api/v1/projects` | Create a new project |
| **GET** | `/api/v1/projects/{id}` | Get a project by ID |
| **PUT** | `/api/v1/projects/{id}` | Update an existing project |
| **PATCH** | `/api/v1/projects/{id}/status` | Update project status |
| **GET** | `/api/v1/projects` | Get all projects |
| **GET** | `/api/v1/projects/course/{course}` | Get projects filtered by course |
| **GET** | `/api/v1/projects/status` | Get projects filtered by status (query param) |
| **GET** | `/api/v1/projects/due-in` | Get projects due within X days (query param) |
| **GET** | `/api/v1/projects/completed` | Get all completed projects |
| **GET** | `/api/v1/projects/priority` | Get projects sorted by priority |
| **PATCH** | `/api/v1/projects/update-priorities` | Update priorities for all projects |
| **DELETE** | `/api/v1/projects/{id}` | Delete a project |
| **POST** | `/api/v1/projects/{projectId}/tasks` | Create a new task in a project |
| **GET** | `/api/v1/projects/{projectId}/tasks/{taskId}` | Get a specific task by ID within a project |
| **PUT** | `/api/v1/projects/{projectId}/tasks/{taskId}` | Update an existing task |
| **PATCH** | `/api/v1/projects/{projectId}/tasks/{taskId}/status` | Update status of a task |
| **GET** | `/api/v1/tasks` | Get all tasks |
| **GET** | `/api/v1/projects/{projectId}/tasks` | Get all tasks for a specific project |
| **GET** | `/api/v1/tasks/status` | Get tasks filtered by status (query param) |
| **GET** | `/api/v1/projects/{projectId}/tasks/incomplete` | Get incomplete tasks for a project |
| **DELETE** | `/api/v1/projects/{projectId}/tasks/{taskId}` | Delete a task |

## File Structure
The tool uses and creates the following directory structure:
```
deadline-manager/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/erikmlarson5/deadlinemanager/
│       │       ├── controller/        # REST controllers for API endpoints
│       │       ├── dto/               # Data Transfer Objects (input/output)
│       │       ├── entity/            # JPA entities mapped to PostgresSQL database tables
│       │       ├── exception/         # Global exception handling
│       │       ├── repository/        # Spring Data JPA repositories
│       │       ├── service/           # Business logic layer
│       │       ├── utils/             # Enums and utility classes
│       │       └── DeadlineManagerApplication.java  # Spring Boot main application
│       └── resources/
│           └── application.properties  # Configuration (DB, app settings)
├── .gitignore
├── mvnw
├── mvnw.cmd
├── pom.xml                          # Maven dependencies and build config
└── README.md
```
