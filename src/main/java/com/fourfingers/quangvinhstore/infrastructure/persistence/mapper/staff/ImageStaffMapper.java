package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Image;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageStaffMapper {
    Image toModel(ImageEntity imageEntity);
}
