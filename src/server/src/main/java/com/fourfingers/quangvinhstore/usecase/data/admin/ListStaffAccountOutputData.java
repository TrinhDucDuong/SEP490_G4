package com.fourfingers.quangvinhstore.usecase.data.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.StaffAccount;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListStaffAccountOutputData {
    private List<StaffAccount> staffAccounts;
}
