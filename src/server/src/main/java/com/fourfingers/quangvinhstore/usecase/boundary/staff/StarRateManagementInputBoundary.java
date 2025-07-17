package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.ListStarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ReplyStarRateInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.UpdateStarRateInputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface StarRateManagementInputBoundary {
    ListStarRateOutputData getAll();

    StarRateOutputData reply(ReplyStarRateInputData replyStarRateInputData, UserDetails userDetails);

    StarRateOutputData get(String id);

    StarRateOutputData disable(String id, UserDetails userDetails);

    StarRateOutputData unDisable(String id, UserDetails userDetails);

    StarRateOutputData update(String id, UserDetails userDetails, UpdateStarRateInputData updateStarRateInputData);
}
