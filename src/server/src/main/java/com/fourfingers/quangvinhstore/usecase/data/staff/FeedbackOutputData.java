package com.fourfingers.quangvinhstore.usecase.data.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Feedback;
import com.fourfingers.quangvinhstore.domain.model.staff.Store;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class FeedbackOutputData {
    private Feedback feedback;
    private Store relatedStore;
}
