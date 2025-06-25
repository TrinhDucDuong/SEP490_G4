package com.fourfingers.quangvinhstore.usecase.data.output.product;

import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductOutputData {
    private Product product;
}
