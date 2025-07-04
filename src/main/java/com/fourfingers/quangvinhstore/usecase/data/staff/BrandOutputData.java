package com.fourfingers.quangvinhstore.usecase.data.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Brand;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BrandOutputData {
    private Brand brand;
}
