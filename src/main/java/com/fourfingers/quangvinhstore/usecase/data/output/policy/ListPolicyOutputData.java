package com.fourfingers.quangvinhstore.usecase.data.output.policy;

import com.fourfingers.quangvinhstore.domain.model.Policy;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListPolicyOutputData {
    private List<Policy> policies;
}
