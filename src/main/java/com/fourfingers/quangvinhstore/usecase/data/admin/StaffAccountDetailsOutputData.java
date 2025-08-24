package com.fourfingers.quangvinhstore.usecase.data.admin;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StaffAccountDetailsOutputData {
    private Long accountId;
    private String staffName;
    private Long totalProcessedOrder;
    private Long totalRevenue;
    private String workingAt;
    private String phoneNumber;
    private String username;
}
