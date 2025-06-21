package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Policy {
    private String policyId;
    private String policyName;
    private String policyDescription;
}
