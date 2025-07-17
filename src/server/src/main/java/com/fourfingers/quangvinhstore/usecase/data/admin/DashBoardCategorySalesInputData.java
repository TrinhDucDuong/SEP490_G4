package com.fourfingers.quangvinhstore.usecase.data.admin;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DashBoardCategorySalesInputData {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
