package com.fourfingers.quangvinhstore.domain.model.staff;

import com.fourfingers.quangvinhstore.domain.model.Account;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StarRate {
    private Long starRateId;
    private Account account;
    private Long starRate;
    private ProductVariant productVariant;
    private String comment;
    private LocalDateTime createdAt;
}
