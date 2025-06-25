package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Store;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StoreMapper {
    StoreEntity toEntity(Store store);
    Store toModel(StoreEntity storeEntity);
}
