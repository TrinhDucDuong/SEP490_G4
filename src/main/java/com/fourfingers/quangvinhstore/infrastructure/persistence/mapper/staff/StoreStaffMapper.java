package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Store;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StoreStaffMapper {
    Store toModel(StoreEntity storeEntity);
    StoreEntity toEntity(Store store);
}
