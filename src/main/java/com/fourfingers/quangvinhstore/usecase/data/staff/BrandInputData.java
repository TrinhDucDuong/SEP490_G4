package com.fourfingers.quangvinhstore.usecase.data.staff;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@Setter
public class BrandInputData {
    private String brandName;
    private String brandDescription;
    private List<MultipartFile> brandImages;
}
