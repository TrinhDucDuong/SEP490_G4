package com.fourfingers.quangvinhstore.usecase.data.output.order;

import com.fourfingers.quangvinhstore.domain.model.Order;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OrderOutputData {
    private Order order;
}
