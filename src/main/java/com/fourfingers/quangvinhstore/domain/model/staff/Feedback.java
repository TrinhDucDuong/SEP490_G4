package com.fourfingers.quangvinhstore.domain.model.staff;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.Image;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Feedback {
    private Long feedbackId;
    private String feedbackTitle;
    private String feedbackContent;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private Account createdBy;
    private Account updatedBy;
    private LocalDateTime updatedAt;
    private List<Image> feedbackImages;
}
