package com.fourfingers.quangvinhstore.usecase.data.staff;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ReplyStarRateInputData {
    private Long replyId;
    private String comment;
}
