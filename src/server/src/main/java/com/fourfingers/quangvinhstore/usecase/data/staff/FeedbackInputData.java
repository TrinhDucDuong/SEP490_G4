package com.fourfingers.quangvinhstore.usecase.data.staff;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class FeedbackInputData {
    private String feedbackTitle;
    private String feedbackContent;
    private Long storeId;
}
