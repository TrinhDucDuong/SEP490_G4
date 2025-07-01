package com.fourfingers.quangvinhstore.usecase.data.auth;

import com.fourfingers.quangvinhstore.domain.model.SNS;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SNSOutputData {
    private SNS sns;
}
