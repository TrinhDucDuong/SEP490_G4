package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.domain.model.ProductVariant;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {
    ProductVariant toModel(ProductVariantEntity productVariantEntity);
    ProductVariantEntity toEntity(ProductVariant productVariant);
}
