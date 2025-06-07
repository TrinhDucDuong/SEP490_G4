package com.fourfingers.quangvinhstore.usecase.data.output;

import com.fourfingers.quangvinhstore.domain.model.Account;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationOutputData {
    /*
    * This is structure of date to response to client
    * In this class we can also define more than one model to response to clients
    * For example: Response to client can include: Product (Suggestion), Account Information
    * Therefore we can define 2 model in this class.
    * For each response to controller, we define their own OutputData
    */
    private Account account;
    private String token;
}
