package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.CartDetails;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductVariantMapper;
import com.fourfingers.quangvinhstore.infrastructure.schema.CartDetailsEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductVariantMapper.class})
public interface CartMapper {
    CartDetailsEntity toCartDetailsEntity(CartDetails cartDetails);
    CartDetails toCartDetails(CartDetailsEntity cartDetailsEntity);
}
