package com.backend.matchme.utils;
/**
 * Validator for pagination parameters.
 * <p>
 * Ensures that page number and page size values conform to application
 * constraints before creating {@link org.springframework.data.domain.Pageable} objects.
 * This validator enforces maximum page size limits and prevents negative values.
 * </p>
 * <p>
 * Validation rules:
 * <ul>
 *   <li>Page number must be non-negative (0-based indexing)</li>
 *   <li>Page size must be positive (at least 1)</li>
 *   <li>Page size must not exceed the maximum limit (100)</li>
 * </ul>
 * </p>
 *
 * @see org.springframework.data.domain.Pageable
 * @see org.springframework.data.domain.PageRequest
 */
public class PaginationValidator {

    /**
     * Validates pagination parameters before use.
     *
     * @param pageNumber the zero-based page number (must be non-negative)
     * @param pageSize the number of items per page (must be positive and not exceed maximum)
     * @throws IllegalArgumentException if page number is negative, page size is not positive,
     *         or page size exceeds the maximum allowed value
     */
    public static void validate(int pageNumber, int pageSize) {
        if (pageNumber < 0) {
            throw new IllegalArgumentException("Page number must not be negative");
        }

        if (pageSize <= 0) {
            throw new IllegalArgumentException("Page size must be greater than zero");
        }

        if (pageSize > 100) {
            throw new IllegalArgumentException("Page size must not exceed " + 100);
        }

    }

}