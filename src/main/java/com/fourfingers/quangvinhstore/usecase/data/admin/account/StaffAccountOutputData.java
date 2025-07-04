package com.fourfingers.quangvinhstore.usecase.data.admin.account;

import com.fourfingers.quangvinhstore.domain.model.admin.StaffAccount;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StaffAccountOutputData {
    private StaffAccount staffAccount;
}
