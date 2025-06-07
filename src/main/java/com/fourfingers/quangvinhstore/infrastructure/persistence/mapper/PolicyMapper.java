package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.Policy;
import com.fourfingers.quangvinhstore.infrastructure.schema.PolicyEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PolicyMapper {
    PolicyEntity toPolicyEntity(Policy policy);
    Policy toPolicy(PolicyEntity policyEntity);
}
