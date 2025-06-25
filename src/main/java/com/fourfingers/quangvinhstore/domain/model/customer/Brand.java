package com.fourfingers.quangvinhstore.domain.model.customer;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Brand {
    private Long brandId;
    private String brandName;
    private String brandDescription;
    private List<Image> images;
}
