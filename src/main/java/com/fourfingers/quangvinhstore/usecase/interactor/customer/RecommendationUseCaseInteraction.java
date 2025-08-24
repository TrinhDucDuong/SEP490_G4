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

/**
 * Implementation of recommendation system use case interactions
 * Handles product recommendations based on user behavior and AI assistance
 *
 * @author LongLTHE170099
 */
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

    /**
     * Gets AI-generated recommendations based on product and user action information
     *
     * @param productInfo   JSON string containing product information
     * @param actionLogInfo JSON string containing user action logs
     * @return String containing AI-generated recommendation response
     * @author LongLTHE170099
     */
    private String getRecommendation(String productInfo, String actionLogInfo) {
        return genAiUtilBoundary.getRecommendation(productInfo, actionLogInfo);
    }

    /**
     * Retrieves and formats all active product information as JSON string
     *
     * @return JSON string containing all active product information
     * @author LongLTHE170099
     */
    private String getProductInfo() {
        List<ProductEntity> productEntities = productRepository.findAll();

        List<Map<String, Object>> productList = productEntities.stream()
                .filter(ProductEntity::getIsActive)
                .map(this::convertProductToMap)
                .collect(Collectors.toList());

        return convertToJson(productList);
    }

    /**
     * Converts a ProductEntity to a Map representation
     *
     * @param product The ProductEntity to convert
     * @return Map containing product information
     * @author LongLTHE170099
     */
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

    /**
     * Converts a list of ProductVariantEntity to List of Maps
     *
     * @param variants List of ProductVariantEntity to convert
     * @return List of Maps containing variant information
     * @author LongLTHE170099
     */
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

    /**
     * Converts an object to its JSON string representation
     *
     * @param productData Object to convert to JSON
     * @return JSON string representation of the object
     * @throws RuntimeException if JSON conversion fails
     * @author LongLTHE170099
     */
    private String convertToJson(Object productData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(productData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi chuyển đổi sang JSON", e);
        }
    }

    /**
     * Retrieves user action logs and converts them to JSON format
     *
     * @param userId ID of the user whose logs to retrieve
     * @return JSON string containing user action logs
     * @author LongLTHE170099
     */
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

    /**
     * Gets product recommendations for a user
     *
     * @param userDetails User details for whom to get recommendations
     * @return ListProductOutputData containing recommended products
     * @author LongLTHE170099
     */
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

    /**
     * Generates and saves product recommendations for a user
     *
     * @param userDetails User details for whom to save recommendations
     * @author LongLTHE170099
     */
    @Override
    public void saveRecommendation(UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        String actionLogInfo = getUserActionLogsAsJson(accountEntity.getAccountId());
        String productInfo = getProductInfo();
        accountEntity.setRecommendedProduct(getRecommendation(productInfo, actionLogInfo));
        accountRepository.save(accountEntity);
    }

    /**
     * Extracts list of product IDs from AI response string
     *
     * @param response AI-generated response containing product IDs
     * @return List of product IDs
     * @throws RuntimeException if JSON parsing fails
     * @author LongLTHE170099
     */
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

    /**
     * Retrieves detailed product information including images
     *
     * @param productId ID of the product to retrieve
     * @return Product object with complete information, or null if not found
     * @author LongLTHE170099
     */
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
