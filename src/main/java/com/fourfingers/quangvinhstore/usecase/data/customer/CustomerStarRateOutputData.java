package com.fourfingers.quangvinhstore.usecase.data.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.StarRate;
import lombok.Data;

@Data
public class CustomerStarRateOutputData {
    private StarRate starRate;

    public CustomerStarRateOutputData(StarRate starRate) {
        this.starRate = starRate;
    }
}
