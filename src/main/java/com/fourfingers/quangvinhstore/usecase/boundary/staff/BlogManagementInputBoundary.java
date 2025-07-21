package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.BlogInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.BlogOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBlogOutputData;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BlogManagementInputBoundary {
    ListBlogOutputData getAll(String blogTags);

    BlogOutputData getById(String id);

    BlogOutputData delete(String id, UserDetails userDetails);

    BlogOutputData create(BlogInputData blogInputData, UserDetails userDetails, List<MultipartFile> blogImages) throws Exception;

    BlogOutputData update(BlogInputData blogInputData, UserDetails userDetails, List<MultipartFile> blogImages, String id) throws Exception;

    BlogOutputData unDelete(String id, UserDetails userDetails);
}
