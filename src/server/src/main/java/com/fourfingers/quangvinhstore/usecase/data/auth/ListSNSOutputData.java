package com.fourfingers.quangvinhstore.usecase.data.auth;

import com.fourfingers.quangvinhstore.domain.model.SNS;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListSNSOutputData {
    private List<SNS> snss;
}
