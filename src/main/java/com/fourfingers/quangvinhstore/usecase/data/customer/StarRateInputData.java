package com.fourfingers.quangvinhstore.usecase.data.customer;

import lombok.Data;

@Data
public class StarRateInputData {
    private Long orderDetailsId;
    private String comment;
    private Long starRate;
}
