package com.fourfingers.quangvinhstore.usecase.data.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Order;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OrderOutputData {
    private Order order;
}
