package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
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
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ChatWithAIUseCaseInteraction implements ChatWithAiInputBoundary {
    private final ProductRepository productRepository;
    private final GenAiUtilBoundary genAiUtilBoundary;
    private final ChatWithAiOutputBoundary chatWithAiOutputBoundary;
    @Override
    @Transactional
    public ResponseFromAiOutputData getResponse(QuestionForAiInputData input) {
        return chatWithAiOutputBoundary.convertToChatWithAiOutputData(
                genAiUtilBoundary.callGenAi(
                        getInfoToGeneratingResponse(), input.getQuestion()
                )
        );
    }

    private String getInfoToGeneratingResponse() {
        List<ProductEntity> productEntities = productRepository.findAll();

        return productEntities.stream()
                .filter(ProductEntity::getIsActive)
                .map(product -> {
                    String name = product.getProductName();
                    String description = product.getProductDescription();
                    String price = product.getUnitPrice().setScale(0, RoundingMode.HALF_UP) + "đ";

                    String categoryName = (product.getCategory() != null)
                            ? product.getCategory().getCategoryName()
                            : "Không xác định";

                    String brandName = (product.getBrand() != null)
                            ? product.getBrand().getBrandName()
                            : "Thương hiệu khác";

                    return String.format(
                            "Tên: %s | Mô tả: %s | Giá: %s | Danh mục: %s | Thương hiệu: %s",
                            name, description, price, categoryName, brandName
                    );
                })
                .collect(Collectors.joining("\n"));
    }
}
