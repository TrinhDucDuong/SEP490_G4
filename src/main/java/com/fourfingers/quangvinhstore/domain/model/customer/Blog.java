package com.fourfingers.quangvinhstore.domain.model.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Blog {
    private Long blogId;
    private String blogTitle;
    private String content;
    private List<Image> images;
    private List<Long> relatedProductIds;
    private LocalDateTime createdAt;
}
