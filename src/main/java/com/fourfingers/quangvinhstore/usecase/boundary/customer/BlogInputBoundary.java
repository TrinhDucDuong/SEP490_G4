package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.BlogOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListBlogOutputData;

public interface BlogInputBoundary {
    ListBlogOutputData getAll(String blogTag);

    BlogOutputData getById(String id);
}
