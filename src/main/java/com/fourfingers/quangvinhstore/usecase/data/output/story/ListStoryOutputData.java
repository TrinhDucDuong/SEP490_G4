package com.fourfingers.quangvinhstore.usecase.data.output.story;

import com.fourfingers.quangvinhstore.domain.model.Story;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListStoryOutputData {
    private List<Story> stories;
}
