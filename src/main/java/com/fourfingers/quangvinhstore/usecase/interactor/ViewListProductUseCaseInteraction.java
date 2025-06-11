package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.domain.model.ProductImage;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.ListProductOutputData;
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
    private final ProductImageMapper productImageMapper;

    @Override
    @Transactional
    public ListProductOutputData getListProduct() {
        List<Product> products = productRepository.findAllByIsActiveTrue()
                .stream()
                .map(productEntity -> {
                    Product product = productMapper.toModel(productEntity);
                    List<ProductImage> productImages = productEntity.getProductImages()
                            .stream()
                            .map(productImageMapper::toModel)
                            .toList();
                    product.setProductImages(productImages);
                    return product;
                })
                .toList();
        return productOutputBoundary.convertToListProductOutputData(products);
    }
}
