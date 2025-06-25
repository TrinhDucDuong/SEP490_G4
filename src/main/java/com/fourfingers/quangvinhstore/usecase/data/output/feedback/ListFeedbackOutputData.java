package com.fourfingers.quangvinhstore.usecase.data.output.feedback;

import com.fourfingers.quangvinhstore.domain.model.customer.Feedback;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListFeedbackOutputData {
    private List<Feedback> feedbacks;
}
