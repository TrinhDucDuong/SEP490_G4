package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.BlogOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBlogOutputData;

public interface BlogManagementInputBoundary {
    ListBlogOutputData getAll();

    BlogOutputData getById(String id);

    BlogOutputData delete(String id);
}
