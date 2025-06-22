package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.input.order.ProcessOrderInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.order.OrderOutputData;

public interface OrderManagementInputBoundary {
    ListOrderOutputData getAll(String orderStatus, String sortBy, String sortDirection);

    OrderOutputData processOrder(String id, ProcessOrderInputData processOrderInputData);
}
