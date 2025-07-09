package com.fourfingers.quangvinhstore.usecase.data.admin;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AccountInputData {
    private String username;
    private String password;
    private String email;
    private String authorityName;
}
