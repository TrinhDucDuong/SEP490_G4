package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Brand {
    private String brandId;
    private String brandName;
    private String brandDescription;
    private List<Image> images;
}
