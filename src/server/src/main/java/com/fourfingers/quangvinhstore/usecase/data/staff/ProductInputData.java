package com.fourfingers.quangvinhstore.usecase.data.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.ProductVariant;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductInputData {
    private String productName;
    private String productDescription;
    private String unitPrice;
    private String brandId;
    private String categoryId;
    private List<ProductVariant> productVariants;
    private List<MultipartFile> productImages;
}
