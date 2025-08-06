package com.fourfingers.quangvinhstore.usecase.data.admin;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ResetPasswordStaffAccountInputData {
    private String oldPassword;
    private String newPassword;
}
