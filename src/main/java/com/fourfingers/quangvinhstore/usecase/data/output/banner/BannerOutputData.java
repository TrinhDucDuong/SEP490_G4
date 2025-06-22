package com.fourfingers.quangvinhstore.usecase.data.output.banner;

import com.fourfingers.quangvinhstore.domain.model.Image;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class BannerOutputData {
    private List<Image> bannerImages;
}
