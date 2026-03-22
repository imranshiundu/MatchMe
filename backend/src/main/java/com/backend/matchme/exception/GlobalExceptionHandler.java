package com.backend.matchme.exception;

import com.backend.matchme.dto.ErrorResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler extends RuntimeException {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    //helper to create response for exception.
    private ResponseEntity<ErrorResponseDTO> createErrorResponse(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(new ErrorResponseDTO(status.value(), status.getReasonPhrase(), message));
    }

    //for handling "404 error"(Not Found)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(RuntimeException ex) {
        return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(Exception.class) //handles everything else.
    public ResponseEntity<ErrorResponseDTO> handleAll(Exception ex) {
        log.error("Unhandled exception", ex);
        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred. Please try again later.");
    }
}
