package com.fourfingers.quangvinhstore.usecase.data.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Order;
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
