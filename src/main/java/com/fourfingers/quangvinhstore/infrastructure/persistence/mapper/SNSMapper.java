package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.SNS;
import com.fourfingers.quangvinhstore.infrastructure.schema.SNSEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SNSMapper {
    SNSEntity toSNSEntity(SNS sns);
    SNS toSNS(SNSEntity snsEntity);
}
