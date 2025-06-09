package com.fourfingers.quangvinhstore.usecase.data.output.policy;

import com.fourfingers.quangvinhstore.domain.model.Policy;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PolicyOutputData {
    private Policy policy;
}
