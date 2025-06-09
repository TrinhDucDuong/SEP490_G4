package com.fourfingers.quangvinhstore.usecase.data.output.store;

import com.fourfingers.quangvinhstore.domain.model.Store;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListStoreOutputData {
    private List<Store> stores;
}
