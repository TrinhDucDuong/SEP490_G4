package com.fourfingers.quangvinhstore.usecase.data.customer;

import lombok.*;

@Data
public class ProductVariantInputData {
    private Long productId;
    private String colorHexCode;
    private String sizeCode;
    private Short quantity;
}
