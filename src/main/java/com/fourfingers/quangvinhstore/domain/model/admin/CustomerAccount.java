package com.fourfingers.quangvinhstore.domain.model.admin;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CustomerAccount {
    private Long accountId;
    private String username;
    private String email;
    private String fullName;
    private Boolean isActive;
    private LocalDate birthDate;
    private String phoneNumber;
}
