package com.fourfingers.quangvinhstore.usecase.data.output.blog;

import com.fourfingers.quangvinhstore.domain.model.Blog;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListBlogOutputData {
    private List<Blog> blogs;
}
