package com.fourfingers.quangvinhstore.usecase.data.input.product;

import com.fourfingers.quangvinhstore.domain.model.ProductVariant;
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
    private List<ProductVariant> productVariants;
    private List<MultipartFile> productImages;
}
