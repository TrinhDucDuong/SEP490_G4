package com.fourfingers.quangvinhstore.domain.model.staff;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Image {
    private Long imageId;
    private String imageUrl;
    private Boolean isActive;
}
