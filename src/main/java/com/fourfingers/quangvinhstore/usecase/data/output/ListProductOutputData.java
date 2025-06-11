package com.fourfingers.quangvinhstore.usecase.data.output;

import com.fourfingers.quangvinhstore.domain.model.Product;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListProductOutputData {
    private List<Product> products;
}
