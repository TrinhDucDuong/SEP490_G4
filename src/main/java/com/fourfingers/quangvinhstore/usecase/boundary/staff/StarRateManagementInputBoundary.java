package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.ListStarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ReplyStarRateInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StarRateOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface StarRateManagementInputBoundary {
    ListStarRateOutputData getAll();

    StarRateOutputData reply(ReplyStarRateInputData replyStarRateInputData, UserDetails userDetails);

    StarRateOutputData get(String id);
}
