package com.fourfingers.quangvinhstore.domain.model.staff;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Policy {
    private Long policyId;
    private String policyName;
    private String policyDescription;
    private LocalDateTime createdAt;
}
