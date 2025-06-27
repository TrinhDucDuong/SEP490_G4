package com.fourfingers.quangvinhstore.domain.model.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Blog {
    private Long blogId;
    private String blogTitle;
    private List<BlogBlock> blogContents;
    private List<Image> images;
}
