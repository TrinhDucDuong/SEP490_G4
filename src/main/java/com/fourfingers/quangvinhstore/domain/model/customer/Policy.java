package com.fourfingers.quangvinhstore.domain.model.customer;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Policy {
    private Long policyId;
    private String policyName;
    private String policyDescription;
}
