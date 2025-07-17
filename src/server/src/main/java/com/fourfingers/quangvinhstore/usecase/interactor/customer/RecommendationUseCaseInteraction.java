package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ActionLogRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.GenAiUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.RecommendationInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class RecommendationUseCaseInteraction implements RecommendationInputBoundary {
    private final GenAiUtilBoundary genAiUtilBoundary;
    private final ProductRepository productRepository;
    private final ActionLogRepository actionLogRepository;
    private final ProductOutputBoundary productOutputBoundary;
    private final ProductMapper productMapper;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final AccountRepository accountRepository;

    private String getRecommendation(String productInfo, String actionLogInfo) {
        return genAiUtilBoundary.getRecommendation(productInfo, actionLogInfo);
    }

    private String getProductInfo() {
        List<ProductEntity> productEntities = productRepository.findAll();

        List<Map<String, Object>> productList = productEntities.stream()
                .filter(ProductEntity::getIsActive)
                .map(this::convertProductToMap)
                .collect(Collectors.toList());

        return convertToJson(productList);
    }

    private Map<String, Object> convertProductToMap(ProductEntity product) {
        Map<String, Object> productMap = new LinkedHashMap<>();
        productMap.put("productId", product.getProductId());
        productMap.put("productName", product.getProductName());
        productMap.put("description", product.getProductDescription());
        productMap.put("price", product.getUnitPrice());
        productMap.put("category", product.getCategory() != null ? product.getCategory().getCategoryName() : "Không xác định");
        productMap.put("brand", product.getBrand() != null ? product.getBrand().getBrandName() : "Thương hiệu khác");
        productMap.put("variants", convertVariantsToList(product.getProductVariants()));
        return productMap;
    }

    private List<Map<String, Object>> convertVariantsToList(List<ProductVariantEntity> variants) {
        if (variants == null) return List.of();

        return variants.stream()
                .map(variant -> {
                    Map<String, Object> variantMap = new LinkedHashMap<>();
                    variantMap.put("variantId", variant.getProductVariantId());
                    variantMap.put("size", variant.getProductSize() != null ? variant.getProductSize().name() : "Không xác định");
                    variantMap.put("color", variant.getColor() != null ? variant.getColor().getColorHex() : "Không xác định");
                    variantMap.put("quantity", variant.getQuantity() != null ? variant.getQuantity() : 0);
                    return variantMap;
                })
                .collect(Collectors.toList());
    }

    private String convertToJson(Object productData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(productData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi chuyển đổi sang JSON", e);
        }
    }

    private String getUserActionLogsAsJson(Long userId) {
        var logs = actionLogRepository.findTop20ActionLogEntitiesByPerformerIdOrderByActionTimeDesc(userId);

        List<Map<String, Object>> actionList = logs.stream()
                .map(log -> {
                    Map<String, Object> actionMap = new LinkedHashMap<>();
                    actionMap.put("action", log.getActionType().name()); // ADD_TO_CART, VIEW_DETAILS, ORDER
                    actionMap.put("referenceId", log.getReferenceId());
                    actionMap.put("time", log.getActionTime().toString());
                    actionMap.put("referenceType", log.getReferenceType().name());
                    return actionMap;
                })
                .collect(Collectors.toList());

        return convertToJson(actionList);
    }

    @Override
    public ListProductOutputData getRecommendation(UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        String recommendedProductInfo = accountEntity.getRecommendedProduct();
        List<Product> recommendedProduct = null;
        if (recommendedProductInfo != null && !recommendedProductInfo.isBlank()) {
             recommendedProduct = getListProductIdFromResponse(recommendedProductInfo)
                    .stream()
                    .map(this::getProductInformation)
                    .toList();
        }
        if(recommendedProduct == null)  {
            Pageable pageable = PageRequest.of(0, 15);
            recommendedProduct = productRepository.findAll(pageable).stream().map(productMapper::toModel).toList();
        }
        return productOutputBoundary.convertToListProductOutputData(recommendedProduct);
    }

    @Override
    public void saveRecommendation(UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        String actionLogInfo = getUserActionLogsAsJson(accountEntity.getAccountId());
        String productInfo = getProductInfo();
        accountEntity.setRecommendedProduct(getRecommendation(productInfo, actionLogInfo));
        accountRepository.save(accountEntity);
    }

    private List<Long> getListProductIdFromResponse(String response) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String cleaned = response
                    .replaceAll("(?s)```json\\s*", "")
                    .replaceAll("(?s)```", "")
                    .trim();

            return objectMapper.readValue(cleaned, new TypeReference<List<Long>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi parse JSON từ Markdown:\n" + response, e);
        }
    }

    private Product getProductInformation(Long productId) {
        ProductEntity productEntity = productRepository.findById(productId).orElse(null);

        if(productEntity == null) return null;
        Product product = productMapper.toModel(productEntity);
        List<Image> images = imageRepository.findAllByReferenceIdAndImageType(productEntity.getProductId(),
                ImageType.PRODUCT).stream().map(imageMapper::toModel).toList();
        product.setImages(images);
        return product;
    }
}
