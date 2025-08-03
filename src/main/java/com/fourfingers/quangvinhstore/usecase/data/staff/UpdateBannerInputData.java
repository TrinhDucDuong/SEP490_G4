package com.fourfingers.quangvinhstore.usecase.data.staff;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UpdateBannerInputData {
    private List<Long> deActiveIds;
    private List<Long> activeIds;
}
