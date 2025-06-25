package com.fourfingers.quangvinhstore.domain.model.staff;

import com.fourfingers.quangvinhstore.domain.model.Account;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Story {
    private Long storyId;
    private String title;
    private String content;
    private Account createdBy;
    private LocalDateTime createdAt;
    private Boolean isActive;
}
