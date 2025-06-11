package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.ProductImage;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductImageEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {
    ProductImageEntity toEntity(ProductImage productImage);
    ProductImage toModel(ProductImageEntity productImageEntity);
}
