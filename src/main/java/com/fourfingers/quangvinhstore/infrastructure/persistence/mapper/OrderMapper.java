package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.Order;
import com.fourfingers.quangvinhstore.infrastructure.schema.OrderEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderEntity toEntity(Order order);
    Order toModel(OrderEntity entity);
}
