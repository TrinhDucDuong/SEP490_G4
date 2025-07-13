package com.fourfingers.quangvinhstore.usecase.data.customer;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ActionLogInputData {
    private String actionType;
    private Long referenceId;
    private String referenceType;
}
