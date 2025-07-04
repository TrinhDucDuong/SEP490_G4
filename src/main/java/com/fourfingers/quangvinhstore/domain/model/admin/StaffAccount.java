package com.fourfingers.quangvinhstore.domain.model.admin;

import com.fourfingers.quangvinhstore.domain.model.Account;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StaffAccount {
    private Long accountId;
    private String staffName;
    private Long totalProcessedOrder;
    private Long totalRevenue;
    private Account createdBy;
    private Account updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
