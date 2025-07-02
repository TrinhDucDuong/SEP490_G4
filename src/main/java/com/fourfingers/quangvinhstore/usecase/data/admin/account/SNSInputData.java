package com.fourfingers.quangvinhstore.usecase.data.admin.account;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SNSInputData {
    private Long snsId;
    private String snsName;
    private String snsUrl;
    private String snsChatUrl;
}
