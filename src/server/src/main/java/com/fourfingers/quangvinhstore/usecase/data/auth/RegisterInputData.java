package com.fourfingers.quangvinhstore.usecase.data.auth;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RegisterInputData {
    private String username;
    private String password;
    private String email;
}
