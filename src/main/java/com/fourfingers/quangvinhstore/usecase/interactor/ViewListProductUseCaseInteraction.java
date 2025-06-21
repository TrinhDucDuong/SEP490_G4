package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ViewListProductUseCaseInteraction implements ProductInputBoundary {
    private final ProductOutputBoundary productOutputBoundary;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ListProductOutputData getListProduct() {
        List<Product> products = productRepository.findAllByIsActiveTrue()
                .stream()
                .map(productMapper::toModel)
                .toList();
        return productOutputBoundary.convertToListProductOutputData(products);
    }
}
