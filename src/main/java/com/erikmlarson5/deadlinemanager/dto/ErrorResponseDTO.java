package com.erikmlarson5.deadlinemanager.dto;

import java.time.LocalDateTime;

/**
 * A DTO containing an error message of thrown exceptions and the timestamp when it occurred
 */
public class ErrorResponseDTO {
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponseDTO(String message, LocalDateTime timestamp) {
        this.message = message;
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}