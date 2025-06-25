package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Policy;
import com.fourfingers.quangvinhstore.infrastructure.schema.PolicyEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PolicyStaffMapper {
    Policy toModel(PolicyEntity policyEntity);
    PolicyEntity toEntity(Policy policy);
}
