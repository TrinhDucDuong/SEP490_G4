package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ActionLogInputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface ActionLogInputBoundary {
    void logAction(ActionLogInputData actionLogInputData, UserDetails userDetails);
}
