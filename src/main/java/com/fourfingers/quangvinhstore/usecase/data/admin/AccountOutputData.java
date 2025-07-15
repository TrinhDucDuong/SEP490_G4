package com.fourfingers.quangvinhstore.usecase.data.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CustomerAccount;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AccountOutputData {
    private CustomerAccount account;
}
