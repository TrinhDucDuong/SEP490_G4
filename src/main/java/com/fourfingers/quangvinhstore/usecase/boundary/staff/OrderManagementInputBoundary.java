package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.ProcessOrderInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;

public interface OrderManagementInputBoundary {
    ListOrderOutputData getAll(String orderStatus, String sortBy, String sortDirection);

    OrderOutputData processOrder(String id, ProcessOrderInputData processOrderInputData);
}
