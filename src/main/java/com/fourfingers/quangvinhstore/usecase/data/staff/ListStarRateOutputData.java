package com.fourfingers.quangvinhstore.usecase.data.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.StarRate;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListStarRateOutputData {
    private List<StarRate> starRates;
}
