package com.fourfingers.quangvinhstore.usecase.data.auth;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AuthenticationInputData {
    private String username;
    private String password;
}
