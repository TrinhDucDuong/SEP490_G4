package com.fourfingers.quangvinhstore.usecase.data.output.account;

import com.fourfingers.quangvinhstore.domain.model.Account;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListAccountOutputData {
    private List<Account> accounts;
}
