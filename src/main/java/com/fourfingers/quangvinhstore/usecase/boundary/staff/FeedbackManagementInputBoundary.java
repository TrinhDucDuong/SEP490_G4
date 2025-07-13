package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.ListFeedbackOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackOutputData;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FeedbackManagementInputBoundary {
    FeedbackOutputData create(FeedbackInputData feedbackInputData, List<MultipartFile> images, UserDetails userDetails)
            throws Exception;

    ListFeedbackOutputData getAll();

    FeedbackOutputData update(String id, FeedbackInputData feedbackInputData, List<MultipartFile> feedbackImages,
                              UserDetails userDetails) throws Exception;

    FeedbackOutputData delete(String id, UserDetails userDetails);

    FeedbackOutputData unDelete(String id, UserDetails userDetails);

    FeedbackOutputData get(String id);
}
