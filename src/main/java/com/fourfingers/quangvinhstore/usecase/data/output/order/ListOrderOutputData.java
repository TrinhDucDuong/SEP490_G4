package com.fourfingers.quangvinhstore.usecase.data.output.order;

import com.fourfingers.quangvinhstore.domain.model.Order;
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
