package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Blog;
import com.fourfingers.quangvinhstore.usecase.data.staff.BlogOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBlogOutputData;

import java.util.List;

public interface BlogManagementOutputBoundary {
    BlogOutputData convertToBlogOutputData(Blog blog);
    ListBlogOutputData convertToListBlogOutputData(List<Blog> blogs);
}
