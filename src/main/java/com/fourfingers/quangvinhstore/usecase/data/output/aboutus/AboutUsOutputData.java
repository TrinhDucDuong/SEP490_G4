package com.fourfingers.quangvinhstore.usecase.data.output.aboutus;

import com.fourfingers.quangvinhstore.domain.model.Store;
import com.fourfingers.quangvinhstore.domain.model.Story;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AboutUsOutputData {
    private List<Store> stores;
    private List<Story> stories;
}
