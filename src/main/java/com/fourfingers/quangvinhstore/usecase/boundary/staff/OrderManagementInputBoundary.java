package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.ProcessOrderInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.OrderOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface OrderManagementInputBoundary {
    ListOrderOutputData getAll(String orderStatus, String sortBy, String sortDirection);

    OrderOutputData processOrder(String id, ProcessOrderInputData processOrderInputData, UserDetails userDetails);
}
