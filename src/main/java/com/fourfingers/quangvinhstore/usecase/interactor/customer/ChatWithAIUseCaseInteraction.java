package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.GenAiUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ChatWithAiInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ChatWithAiOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.QuestionForAiInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ResponseFromAiOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ChatWithAIUseCaseInteraction implements ChatWithAiInputBoundary {
    private final ProductRepository productRepository;
    private final GenAiUtilBoundary genAiUtilBoundary;
    private final ChatWithAiOutputBoundary chatWithAiOutputBoundary;
    private final StoreRepository storeRepository;
    @Override
    @Transactional
    public ResponseFromAiOutputData getResponse(QuestionForAiInputData input) {
        return chatWithAiOutputBoundary.convertToChatWithAiOutputData(
                genAiUtilBoundary.callGenAi(
                        getInfoToGeneratingResponse(input.getQuestion()), input.getQuestion()
                )
        );
    }

    private String getInfoToGeneratingResponse(String question) {
        if (isRelatedToStore(question)) {
            return getStoreInfoAsJson();
        }
        List<ProductEntity> productEntities = productRepository.findAll();

        List<Map<String, Object>> productList = productEntities.stream()
                .filter(ProductEntity::getIsActive)
                .map(this::convertProductToMap)
                .collect(Collectors.toList());

        return convertToJson(productList);
    }

    private Map<String, Object> convertProductToMap(ProductEntity product) {
        Map<String, Object> productMap = new LinkedHashMap<>();
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
                    variantMap.put("size", variant.getProductSize() != null ? variant.getProductSize().name() : "Không xác định");
                    variantMap.put("color", variant.getColor() != null ? variant.getColor().getColorHex() : "Không xác định");
                    variantMap.put("quantity", variant.getQuantity() != null ? variant.getQuantity() : 0);
                    return variantMap;
                })
                .collect(Collectors.toList());
    }

    private String convertToJson(Object data) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi chuyển đổi sang JSON", e);
        }
    }

    private boolean isRelatedToStore(String input) {
        if (input == null || input.isBlank()) return false;
        String normalized = input.toLowerCase();
        String[] storeKeywords = {
                "cửa hàng", "shop", "store", "địa chỉ", "ở đâu", "mở cửa", "giờ mở", "giờ đóng",
                "chi nhánh", "cơ sở", "vị trí", "location", "open time", "opening hours",
                "store hours", "how to get there", "đường đến", "map", "google map", "tìm cửa hàng",
                "store locator", "gần nhất", "xa nhất", "có mặt tại", "trụ sở", "headquarter",
                "bán tại", "nằm ở", "địa điểm", "điểm bán", "điểm phân phối", "chỗ nào", "nơi nào",
                "available in", "available at", "where is", "branch", "distribution point",
                "can I visit", "giao hàng tại cửa hàng", "pickup tại cửa hàng", "click and collect", "ở"
        };
        for (String keyword : storeKeywords) {
            if (normalized.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String getStoreInfoAsJson() {
        List<StoreEntity> stores = storeRepository.findAll();

        List<Map<String, Object>> storeList = stores.stream()
                .filter(StoreEntity::getIsActive)
                .map(store -> {
                    Map<String, Object> storeMap = new LinkedHashMap<>();
                    storeMap.put("storeName", store.getStoreName());
                    storeMap.put("storeAddress", store.getStoreAddress());
                    return storeMap;
                })
                .collect(Collectors.toList());

        return convertToJson(storeList);
    }
}
