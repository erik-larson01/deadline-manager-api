package com.erikmlarson5.deadlinemanager.exception;

import com.erikmlarson5.deadlinemanager.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalArgumentException(IllegalArgumentException e) {
        ErrorResponseDTO error = new ErrorResponseDTO(e.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalStateException(IllegalStateException e) {
        ErrorResponseDTO error = new ErrorResponseDTO(e.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponseDTO> handleNoSuchElementException(NoSuchElementException e) {
        ErrorResponseDTO error = new ErrorResponseDTO(e.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationException(MethodArgumentNotValidException e) {
        StringBuilder errorMessage = new StringBuilder("Validation failed: ");
        e.getBindingResult().getFieldErrors().forEach(error -> {
            errorMessage.append("[").append(error.getField()).append(": ").append(error.getDefaultMessage()).append("] ");
        });

        ErrorResponseDTO error = new ErrorResponseDTO(errorMessage.toString().trim(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Generic fallback exception handler for any other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGenericException(Exception e) {
        ErrorResponseDTO error = new ErrorResponseDTO("An unexpected error occurred: " + e.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}