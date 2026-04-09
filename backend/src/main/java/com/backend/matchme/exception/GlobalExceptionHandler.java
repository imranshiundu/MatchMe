package com.backend.matchme.exception;

import com.backend.matchme.dto.error.ErrorResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Helper to create a consistent error response
    private ResponseEntity<ErrorResponseDTO> createErrorResponse(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(new ErrorResponseDTO(status.value(), status.getReasonPhrase(), message));
    }

    // 404 Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(ResourceNotFoundException ex) {
        log.info("Resource not found: {}", ex.getMessage());
        return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 409 Conflict for duplicate email
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        log.info("Email conflict: {}", ex.getMessage());
        return createErrorResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    // 400 Bad Request for password mismatch
    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<ErrorResponseDTO> handlePasswordMismatch(PasswordMismatchException ex) {
        log.info("Password mismatch: {}", ex.getMessage());
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    //400 Bad Request for password too short
    @ExceptionHandler(PasswordTooShortException.class)
    public ResponseEntity<ErrorResponseDTO> handlePasswordTooShort(PasswordTooShortException ex) {
        log.info("Password too short: {}", ex.getMessage());
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 400 Bad Request for validation errors which catches @NotNull, @Email, @NotBlank, @Size etc.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex) {
        // Get first validation error message
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Validation error");

        log.info("Validation failed: {}", errorMessage);
        return createErrorResponse(HttpStatus.BAD_REQUEST, errorMessage);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidCredentials(InvalidCredentialsException ex) {
        log.info("Invalid credentials: {}", ex.getMessage());
        return createErrorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(PasswordReuseException.class)
    public ResponseEntity<ErrorResponseDTO> handlePasswordInUse(PasswordReuseException ex) {
        log.info("Password already in use: {}", ex.getMessage());
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidOldPassword(InvalidPasswordException ex) {
        log.info("Current password mismatch: {}", ex.getMessage());
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccessDenied(AccessDeniedException ex) {
        log.info("Access denied: {}", ex.getMessage());
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }
    @ExceptionHandler(UploadFailedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccessDenied(UploadFailedException ex) {
        log.info("Image upload failed: {}", ex.getMessage());
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // Catch-all for unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleAll(Exception ex) {
        log.error("Unhandled exception", ex);
        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later or contact support.");
    }


}