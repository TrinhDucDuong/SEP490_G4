package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Blog;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListBlogOutputData;

import java.util.List;

public interface BlogOutputBoundary {
    ListBlogOutputData convertToListBlogOutputData(List<Blog> blogs);
}
