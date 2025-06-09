package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.Store;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StoreMapper {
    StoreEntity toEntity(StoreEntity storeEntity);
    Store toStore(StoreEntity storeEntity);
}
