package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Blog {
    private String blogId;
    private String blogTitle;
    private String blogContent;
    private List<String> imageUrls;
}
