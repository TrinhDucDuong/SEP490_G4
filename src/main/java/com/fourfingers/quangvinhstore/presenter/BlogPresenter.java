package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.customer.Blog;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BlogOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.blog.ListBlogOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BlogPresenter implements BlogOutputBoundary {
    @Override
    public ListBlogOutputData convertToListBlogOutputData(List<Blog> blogs) {
        return new ListBlogOutputData(blogs);
    }
}
