package com.fourfingers.quangvinhstore.domain.model.staff;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.Image;
import lombok.*;

import java.time.LocalDateTime;
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
    private Boolean isActive;
    private List<Image> images;
    private LocalDateTime createdAt;
    private Account createdBy;
    private Account updatedBy;
    private LocalDateTime updatedAt;
}
