package com.fourfingers.quangvinhstore.usecase.data.customer;

import lombok.Data;

@Data
public class CartInputData {
    private Long cartDetailsId;
    private Long accountId;
    private Long productId;
    private String colorHexCode;
    private String sizeCode;
    private Short quantity;
}
