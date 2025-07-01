package com.fourfingers.quangvinhstore.usecase.data.auth;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SNSAuthInputData {
    private String email;
    private String name;
    private String facebookId;
}
