package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Feedback;
import com.fourfingers.quangvinhstore.infrastructure.schema.FeedbackEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FeedbackStaffMapper {
    Feedback toModel(FeedbackEntity feedbackEntity);
    FeedbackEntity toEntity(Feedback feedback);
}
