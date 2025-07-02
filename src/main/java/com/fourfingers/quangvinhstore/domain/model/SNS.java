package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SNS {
    private Long snsId;
    private String snsName;
    private String snsUrl;
    private String snsChatUrl;
}
