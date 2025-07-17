package com.fourfingers.quangvinhstore.usecase.data.staff;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BlogInputData {
    private String blogTitle;
    private String content;
    private List<Long> relatedProductIds;
}
