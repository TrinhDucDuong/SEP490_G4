package com.fourfingers.quangvinhstore.usecase.data.customer.order;

import lombok.Data;

@Data
public class OrderInputData {
    private Long productId;
    private String colorHexCode;
    private String sizeCode;
    private Short quantity;
}
