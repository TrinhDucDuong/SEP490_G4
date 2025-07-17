package com.fourfingers.quangvinhstore.domain.model.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.ProductVariant;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StarRate {
    private Long starRate;
    private String comment;
    private ProductVariant productVariant;
    private LocalDateTime createdAt;
    private String profileName;
    private Image profileImage;
}
