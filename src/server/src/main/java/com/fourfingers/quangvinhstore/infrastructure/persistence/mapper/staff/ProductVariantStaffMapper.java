package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.ProductVariant;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductVariantStaffMapper {
    ProductVariant toModel(ProductVariantEntity productVariantEntity);
    ProductVariantEntity toEntity(ProductVariant productVariant);
}
