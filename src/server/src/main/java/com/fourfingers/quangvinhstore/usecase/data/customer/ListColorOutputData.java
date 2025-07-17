package com.fourfingers.quangvinhstore.usecase.data.customer;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Builder
public class ListColorOutputData {
    private List<String> colorHex;
}
