package com.fourfingers.quangvinhstore.usecase.data.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.StarRate;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Data
public class StarRateOutputData {
    private StarRate customerStarRate;
    private List<StarRate> staffReplyStarRate;
}
