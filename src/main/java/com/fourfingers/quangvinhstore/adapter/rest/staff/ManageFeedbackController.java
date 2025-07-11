package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.FeedBackManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/staff/feedback")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageFeedbackController {
    private final FeedBackManagementInputBoundary feedBackManagementInputBoundary;
}
