package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Order;
import com.fourfingers.quangvinhstore.infrastructure.schema.OrderEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderStaffMapper {
    Order toModel(OrderEntity orderEntity);
    OrderEntity toEntity(Order order);
}
