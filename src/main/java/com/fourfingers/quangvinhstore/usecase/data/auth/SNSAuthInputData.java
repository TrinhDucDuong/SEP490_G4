package com.fourfingers.quangvinhstore.usecase.data.auth;

import lombok.*;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SNSAuthInputData {
    OAuth2AuthenticationToken token;
}
