package com.fourfingers.quangvinhstore.adapter.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class StoreExceptionHandler {
    @ExceptionHandler(StoreNotFoundException.class)
    public ErrorResponse handleStoreNotFoundException(StoreNotFoundException e) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );
    }

    @ExceptionHandler(Exception.class)
    public ErrorResponse handleStoreNotFoundException(Exception e) {
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );
    }
}
