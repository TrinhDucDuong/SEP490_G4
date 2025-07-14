package com.fourfingers.quangvinhstore.usecase.data.admin;

import com.azure.core.annotation.Get;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StaffAccountInputData {
    private String username;
    private String password;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String workingAtStoreId;
}
