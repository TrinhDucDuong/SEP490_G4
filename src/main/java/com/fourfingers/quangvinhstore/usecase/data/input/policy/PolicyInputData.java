package com.fourfingers.quangvinhstore.usecase.data.input.policy;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PolicyInputData {
    private String policyName;
    private String policyDescription;
}
