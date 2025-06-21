package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.usecase.data.input.product.SearchProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;

public interface ProductInputBoundary {
    ListProductOutputData search(SearchProductInputData searchProductInputData);
}
