package com.fourfingers.quangvinhstore.adapter.exception;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ErrorResponse {
    private int statusCode;
    private String message;
    private long timestamp;
}
