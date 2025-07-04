package com.erikmlarson5.deadlinemanager.exception;

import com.erikmlarson5.deadlinemanager.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

/**
 * An exception handler that listens to any thrown exception by any controller, providing
 * accurate response messages and HTTP statues based on the exception
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles any thrown Illegal Argument Exception
     * @param e the IllegalArgumentException to be handled
     * @return an error message and an HTTP bad request status
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalArgumentException(IllegalArgumentException e) {
        ErrorResponseDTO error = new ErrorResponseDTO(e.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles any thrown Illegal State Exception
     * @param e the IllegalStateException to be handled
     * @return an error message and an HTTP conflict status
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalStateException(IllegalStateException e) {
        ErrorResponseDTO error = new ErrorResponseDTO(e.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    /**
     * Handles any thrown No Such Element Exception
     * @param e the NoSuchElementException to be handled
     * @return an error message and an HTTP not found status
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponseDTO> handleNoSuchElementException(NoSuchElementException e) {
        ErrorResponseDTO error = new ErrorResponseDTO(e.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles any thrown Method Argument Not Valid Exception
     * @param e the MethodArgumentNotValidException to be handled
     * @return an error message including all Jakarta validation failures
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationException(MethodArgumentNotValidException e) {
        StringBuilder errorMessage = new StringBuilder("Validation failed: ");
        e.getBindingResult().getFieldErrors().forEach(error -> {
            errorMessage.append("[").append(error.getField()).append(": ").append(error.getDefaultMessage()).append("] ");
        });

        ErrorResponseDTO error = new ErrorResponseDTO(errorMessage.toString().trim(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles any thrown leftover Exception
     * @param e the exception to be handled
     * @return an error message including an HTTP internal service error status
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGenericException(Exception e) {
        ErrorResponseDTO error = new ErrorResponseDTO("An unexpected error occurred: " + e.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}