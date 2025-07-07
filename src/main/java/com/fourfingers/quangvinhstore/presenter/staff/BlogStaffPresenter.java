package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Blog;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BlogManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BlogOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBlogOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BlogStaffPresenter implements BlogManagementOutputBoundary {
    @Override
    public BlogOutputData convertToBlogOutputData(Blog blog) {
        return new BlogOutputData(blog);
    }

    @Override
    public ListBlogOutputData convertToListBlogOutputData(List<Blog> blogs) {
        return new ListBlogOutputData(blogs);
    }
}
