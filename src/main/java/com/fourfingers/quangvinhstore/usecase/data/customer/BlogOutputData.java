package com.fourfingers.quangvinhstore.usecase.data.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Blog;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BlogOutputData {
    private Blog blog;
}
