package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Feedback {
    private String feedbackId;
    private String feedbackTitle;
    private String feedbackContent;
    private List<Image> images;
}
