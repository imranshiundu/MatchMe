package com.backend.matchme.exception;

public class InvalidProfileAttributeException extends RuntimeException {
    public InvalidProfileAttributeException(String message) {
        super(message);
    }
}
