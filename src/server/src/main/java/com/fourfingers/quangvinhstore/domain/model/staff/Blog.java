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
public class Blog {
    private Long blogId;
    private String blogTitle;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Account createdBy;
    private Account updatedBy;
    private Boolean isActive;
    private List<Product> relatedProducts;
    private List<Image> blogImages;
}
