package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Image;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    ImageEntity toEntity(Image image);
    Image toModel(ImageEntity imageEntity);
}
