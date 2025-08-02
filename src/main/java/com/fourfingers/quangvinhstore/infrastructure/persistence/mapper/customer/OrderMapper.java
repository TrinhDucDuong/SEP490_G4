package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Order;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ShippingAddressMapper;
import com.fourfingers.quangvinhstore.infrastructure.schema.OrderEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ShippingAddressMapper.class})
public interface OrderMapper {
    OrderEntity toEntity(Order order);
    Order toModel(OrderEntity entity);
}
