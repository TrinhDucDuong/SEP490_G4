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
public class Category {
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private Boolean isActive;
    private Account createdBy;
    private Account updatedBy;
    private LocalDateTime updatedAt;
    private List<Category> subCategories;
    private Category parentCategory;
    private List<Image> images;
}
