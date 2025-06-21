package com.fourfingers.quangvinhstore.usecase.data.output.brand;

import com.fourfingers.quangvinhstore.domain.model.Brand;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListBrandOutputData {
    private List<Brand> brands;
}
