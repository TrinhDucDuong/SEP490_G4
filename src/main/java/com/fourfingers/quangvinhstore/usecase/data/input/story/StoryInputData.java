package com.fourfingers.quangvinhstore.usecase.data.input.story;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StoryInputData {
    private String title;
    private String content;
}
