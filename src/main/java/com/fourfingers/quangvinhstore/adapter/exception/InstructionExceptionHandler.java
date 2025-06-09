package com.fourfingers.quangvinhstore.adapter.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class InstructionExceptionHandler {
    @ExceptionHandler
    @ResponseBody
    public ErrorResponse handleExceptionNotFoundException(InstructionNotFoundException ex) {
        return new ErrorResponse(HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                System.currentTimeMillis());
    }

    @ExceptionHandler
    @ResponseBody
    public ErrorResponse handleException(Exception ex) {
        return new ErrorResponse(HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                System.currentTimeMillis());
    }
}
