package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Category {
    private Long categoryId;
    private String categoryName;
    private List<Image> images;
}
