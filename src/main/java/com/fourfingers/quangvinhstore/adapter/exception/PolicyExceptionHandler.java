package com.fourfingers.quangvinhstore.adapter.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class PolicyExceptionHandler {
    @ExceptionHandler(PolicyNotFoundException.class)
    @ResponseBody
    public ErrorResponse handlePolicyNotFoundException(PolicyNotFoundException ex) {
        return new ErrorResponse(404,
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
