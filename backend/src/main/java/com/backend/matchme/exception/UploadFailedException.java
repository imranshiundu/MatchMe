package com.backend.matchme.exception;

public class UploadFailedException extends RuntimeException {
    public UploadFailedException(String message) {
        super(message);
    }
}
