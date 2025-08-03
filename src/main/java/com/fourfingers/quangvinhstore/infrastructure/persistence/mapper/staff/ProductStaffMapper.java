package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Product;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductStaffMapper {
    Product toModel(ProductEntity productEntity);
    ProductEntity toEntity(Product product);
    @Mapping(target = "productVariants", ignore = true)
    Product toModelExcludeVariants(ProductEntity entity);
}
