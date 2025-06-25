package com.fourfingers.quangvinhstore.usecase.data.output.store;

import com.fourfingers.quangvinhstore.domain.model.customer.Store;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StoreOutputData {
    private Store store;
}
