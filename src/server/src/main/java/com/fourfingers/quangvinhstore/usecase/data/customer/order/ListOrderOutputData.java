package com.fourfingers.quangvinhstore.usecase.data.customer.order;

import com.fourfingers.quangvinhstore.domain.model.customer.Order;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListOrderOutputData {
    private List<Order> orders;
}
