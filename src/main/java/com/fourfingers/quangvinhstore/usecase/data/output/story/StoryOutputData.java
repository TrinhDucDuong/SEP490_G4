package com.fourfingers.quangvinhstore.usecase.data.output.story;

import com.fourfingers.quangvinhstore.domain.model.Story;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StoryOutputData {
    private Story story;
}
