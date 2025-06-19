package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Color {
    private String colorHex;
    private String colorName;
}
