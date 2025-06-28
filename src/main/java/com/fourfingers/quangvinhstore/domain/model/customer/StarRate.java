package com.fourfingers.quangvinhstore.domain.model.customer;

import com.fourfingers.quangvinhstore.domain.model.Account;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StarRate {
    private Account account;
    private Long starRate;
    private String comment;
    private ProductVariant productVariant;
    private LocalDateTime createdAt;
}
