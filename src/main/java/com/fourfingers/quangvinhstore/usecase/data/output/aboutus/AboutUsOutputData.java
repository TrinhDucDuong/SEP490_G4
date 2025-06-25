package com.fourfingers.quangvinhstore.usecase.data.output.aboutus;

import com.fourfingers.quangvinhstore.domain.model.customer.Store;
import com.fourfingers.quangvinhstore.domain.model.customer.Story;
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
