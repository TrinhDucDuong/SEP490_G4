package com.fourfingers.quangvinhstore.usecase.data.admin;

import com.fourfingers.quangvinhstore.domain.model.CustomerRegistedAccount;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CustomerRegistedAccountOutputData {
    private CustomerRegistedAccount customerRegistedAccount;
}
