package com.fourfingers.quangvinhstore.adapter.exception;

public class InstructionNotFoundException extends RuntimeException{
    public InstructionNotFoundException(String message) {
        super(message);
    }

    public InstructionNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public InstructionNotFoundException(Throwable cause) {
        super(cause);
    }

    protected InstructionNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public InstructionNotFoundException() {
        super();
    }
}
