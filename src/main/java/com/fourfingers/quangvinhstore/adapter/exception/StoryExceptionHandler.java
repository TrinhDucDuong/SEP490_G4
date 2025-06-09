package com.fourfingers.quangvinhstore.adapter.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class StoryExceptionHandler {
    @ExceptionHandler(StoreNotFoundException.class)
    public ErrorResponse handleStoryNotFoundException(StoryNotFoundException ex){
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                System.currentTimeMillis()
        );
    }

    @ExceptionHandler(Exception.class)
    public ErrorResponse handleStoryNotFoundException(Exception ex){
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                System.currentTimeMillis()
        );
    }
}
