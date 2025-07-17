package com.fourfingers.quangvinhstore.adapter.exception;

public class StoryNotFoundException extends RuntimeException {
    public StoryNotFoundException() {
        super();
    }

    public StoryNotFoundException(String message) {
        super(message);
    }

    public StoryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public StoryNotFoundException(Throwable cause) {
        super(cause);
    }

    protected StoryNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
