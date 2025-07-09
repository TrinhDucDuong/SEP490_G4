package com.fourfingers.quangvinhstore.domain.model.admin;

import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DailyRevenue {
    LocalDateTime date;
    BigDecimal revenueByDay;

    public DailyRevenue(LocalDateTime date, Number revenue) {
        this.date = date;
        this.revenueByDay = new BigDecimal(revenue.toString())
                .setScale(2, RoundingMode.HALF_UP);
    }
}
