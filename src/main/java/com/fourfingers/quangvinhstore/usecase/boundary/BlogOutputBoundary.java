package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Blog;
import com.fourfingers.quangvinhstore.usecase.data.output.blog.ListBlogOutputData;

import java.util.List;

public interface BlogOutputBoundary {
    ListBlogOutputData convertToListBlogOutputData(List<Blog> blogs);
}
