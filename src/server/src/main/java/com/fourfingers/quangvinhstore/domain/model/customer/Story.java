package com.fourfingers.quangvinhstore.domain.model.customer;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Story {
    private Long storyId;
    private String title;
    private String content;
}
