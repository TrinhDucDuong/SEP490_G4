package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SNS {
    private String snsName;
    private String snsUrl;
    private String snsChatUrl;
}
