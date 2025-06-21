package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.*;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.BrandMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.CategoryMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BrandRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.CategoryRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.LandingPageInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.LandingPageOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.home.LandingPageOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ViewLandingPageUseCaseInteraction implements LandingPageInputBoundary {
    private final ProductRepository productRepository;
    private final LandingPageOutputBoundary landingPageOutputBoundary;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

    @Override
    @Transactional
    public LandingPageOutputData showLandingPage() {
        Pageable pageable = PageRequest.of(0, 10);
        List<Category> categories = getCategories();
        List<Brand> brands = getBrands();
        List<Feedback> feedbacks = getFeedBacks();
        List<Blog> blogs = getBlogs();
        List<Image> bannerImages = getBannerImages();
        //TODO: add order and count the number of sold product.
        List<Product> topSellingProducts = new ArrayList<>();
        List<Product> newestProducts = getNewestProduct();
        return landingPageOutputBoundary.convertToLandingPageOutputData(newestProducts,
                topSellingProducts,
                brands,
                categories,
                blogs,
                feedbacks,
                bannerImages);
    }

    private List<Product> getNewestProduct() {
        Pageable pageable = PageRequest.of(0, 10);
        return productRepository.findAllByOrderByCreatedAtDesc(pageable)
                .stream()
                .map(productEntity -> {
                    Product product = productMapper.toModel(productEntity);
                    Double avgStarRate = productEntity.getStarRates()
                            .stream()
                            .mapToLong(StarRateEntity::getStarRate)
                            .average()
                            .orElse(0.0);
                    product.setStarRateAvg(avgStarRate);
                    product.setImages(
                            imageRepository.findAllByReferenceIdAndImageType(productEntity.getProductId()
                                    , ImageType.PRODUCT)
                                    .stream()
                                    .map(imageMapper::toModel)
                                    .toList()
                    );
                    return product;
                })
                .toList();
    }

    private List<Category> getCategories() {
        Pageable pageable = PageRequest.of(0, 3);
        return categoryRepository.findAll(pageable)
                .stream()
                .map(categoryEntity -> {
                    Category category = categoryMapper.toModel(categoryEntity);
                    category.setImages(
                            imageRepository.findAllByReferenceIdAndImageType(categoryEntity.getCategoryId(),
                                    ImageType.CATEGORY)
                                    .stream()
                                    .map(imageMapper::toModel)
                                    .toList()
                    );
                    return category;
                })
                .toList();
    }

    //TODO: add get list feedback
    private List<Feedback> getFeedBacks() {
        return new ArrayList<Feedback>();
    }

    //TODO: add get list blog
    private List<Blog> getBlogs() {
        return new ArrayList<Blog>();
    }

    private List<Brand> getBrands() {
        return brandRepository.findAll()
                .stream()
                .map(brandEntity -> {
                    Brand brand = brandMapper.toModel(brandEntity);
                    brand.setImages(
                            imageRepository.findAllByReferenceIdAndImageType(brandEntity.getBrandId(),
                                    ImageType.BRAND)
                                    .stream()
                                    .map(imageMapper::toModel)
                                    .toList()
                    );
                    return brand;
                })
                .toList();
    }

    private List<Image> getBannerImages() {
        return imageRepository.findAllByImageType(ImageType.BANNER)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }
}
