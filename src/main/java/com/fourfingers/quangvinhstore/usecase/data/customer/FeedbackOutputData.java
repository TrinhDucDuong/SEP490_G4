package com.fourfingers.quangvinhstore.usecase.data.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Feedback;
import com.fourfingers.quangvinhstore.domain.model.customer.Store;
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
