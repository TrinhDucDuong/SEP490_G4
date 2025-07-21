package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ProductSize;
import com.fourfingers.quangvinhstore.usecase.boundary.GenAiUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ChatWithAiOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.QuestionForAiInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ResponseFromAiOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.ChatWithAIUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ChatWithAIUseCaseInteractionTest {
    @Mock
    private ProductRepository productRepository;

    @Mock
    private StoreRepository storeRepository;

    @Mock
    private GenAiUtilBoundary genAiUtilBoundary;

    @Mock
    private ChatWithAiOutputBoundary chatWithAiOutputBoundary;

    @InjectMocks
    private ChatWithAIUseCaseInteraction useCase;

    private List<StoreEntity> mockStores;
    private List<ProductEntity> mockProducts;

    @BeforeEach
    public void setUp() {
        StoreEntity store = StoreEntity.builder()
                .storeId(1L)
                .storeName("Long's Store")
                .storeAddress("Hà Nội")
                .isActive(true)
                .build();

        mockStores = List.of(store);

        ProductEntity product = ProductEntity.builder()
                .productId(1L)
                .productName("Long's Product")
                .productDescription("Một chiếc áo siêu ngầu")
                .unitPrice(new BigDecimal("199000"))
                .isActive(true)
                .category(CategoryEntity.builder().categoryName("Áo").build())
                .brand(BrandEntity.builder().brandName("NoBrand").build())
                .productVariants(List.of(
                        ProductVariantEntity.builder()
                                .productSize(ProductSize.M) // giả định enum này có
                                .color(ColorEntity.builder().colorHex("#000000").build())
                                .quantity(10L)
                                .build()
                ))
                .build();

        mockProducts = List.of(product);
    }

    @Test
    void testGetResponse_ShouldReturnResponseFromAiOutputData() {
        String question = "Cửa hàng mở cửa lúc mấy giờ?";
        when(storeRepository.findAll()).thenReturn(mockStores);
        when(genAiUtilBoundary.callGenAi(anyString(), eq(question)))
                .thenReturn("response from genAI");
        when(chatWithAiOutputBoundary.convertToChatWithAiOutputData("response from genAI"))
                .thenReturn(new ResponseFromAiOutputData("OK"));

        // when
        ResponseFromAiOutputData result = useCase.getResponse(new QuestionForAiInputData(question));

        // then
        assertEquals("OK", result.getResponse());
        verify(storeRepository).findAll();
        verify(productRepository, never()).findAll();
    }

    @Test
    void testGetResponse_ShouldReturnProductWhenQuestionIsProductRelated() {
        // given
        String question = "Bạn gợi ý cho tôi một sản phẩm phù hợp?";
        when(productRepository.findAll()).thenReturn(mockProducts);
        when(genAiUtilBoundary.callGenAi(anyString(), eq(question)))
                .thenReturn("product response");
        when(chatWithAiOutputBoundary.convertToChatWithAiOutputData("product response"))
                .thenReturn(new ResponseFromAiOutputData("Gợi ý hay ghê!"));

        // when
        ResponseFromAiOutputData result = useCase.getResponse(new QuestionForAiInputData(question));

        // then
        assertEquals("Gợi ý hay ghê!", result.getResponse());
        verify(storeRepository, never()).findAll();
        verify(productRepository).findAll();
    }

    @Test
    void testGetResponse_ShouldReturnStoreWhenQuestionIsStoreRelated() {
        String question = "Cửa hàng mở cửa lúc mấy giờ?";
        List<StoreEntity> stores = List.of(
                StoreEntity.builder().storeName("Retro").storeAddress("HN").isActive(true).build(),
                StoreEntity.builder().storeName("Inactive").storeAddress("SG").isActive(false).build()
        );

        when(storeRepository.findAll()).thenReturn(stores);
        when(genAiUtilBoundary.callGenAi(anyString(), eq(question)))
                .thenReturn("store response");
        when(chatWithAiOutputBoundary.convertToChatWithAiOutputData("store response"))
                .thenReturn(new ResponseFromAiOutputData("Đây là store"));

        ResponseFromAiOutputData result = useCase.getResponse(new QuestionForAiInputData(question));

        assertEquals("Đây là store", result.getResponse());
        verify(storeRepository).findAll();
        verify(productRepository, never()).findAll();
    }

    @Test
    void test_should_return_product_info_when_question_not_related_to_store() {
        String question = "Tư vấn sản phẩm phù hợp!";
        List<ProductEntity> products = List.of(
                ProductEntity.builder()
                        .productName("Áo Polo")
                        .productDescription("Sang xịn")
                        .unitPrice(new BigDecimal("299000"))
                        .isActive(true)
                        .category(CategoryEntity.builder().categoryName("Áo").build())
                        .brand(BrandEntity.builder().brandName("Zara").build())
                        .productVariants(List.of(
                                ProductVariantEntity.builder()
                                        .productSize(ProductSize.M)
                                        .color(ColorEntity.builder().colorHex("#000000").build())
                                        .quantity(10L).build()
                        ))
                        .build()
        );

        when(productRepository.findAll()).thenReturn(products);
        when(genAiUtilBoundary.callGenAi(anyString(), eq(question)))
                .thenReturn("product response");
        when(chatWithAiOutputBoundary.convertToChatWithAiOutputData("product response"))
                .thenReturn(new ResponseFromAiOutputData("Đây là sản phẩm"));

        ResponseFromAiOutputData result = useCase.getResponse(new QuestionForAiInputData(question));

        assertEquals("Đây là sản phẩm", result.getResponse());
        verify(productRepository).findAll();
        verify(storeRepository, never()).findAll();
    }

    @Test
    void testGetResponse_ShouldReturnProductWithNullFields() {
        String question = "Tư vấn sản phẩm đi!";
        ProductEntity product = ProductEntity.builder()
                .productName("Áo đơn giản")
                .productDescription("Không có gì đặc biệt")
                .unitPrice(new BigDecimal("199000"))
                .isActive(true)
                .category(null)
                .brand(null)
                .productVariants(List.of(
                        ProductVariantEntity.builder()
                                .productSize(null)
                                .color(null)
                                .quantity(null)
                                .build()
                ))
                .build();

        when(productRepository.findAll()).thenReturn(List.of(product));
        when(genAiUtilBoundary.callGenAi(anyString(), eq(question)))
                .thenReturn("missing field response");
        when(chatWithAiOutputBoundary.convertToChatWithAiOutputData("missing field response"))
                .thenReturn(new ResponseFromAiOutputData("Thiếu nhưng vẫn chạy"));

        ResponseFromAiOutputData result = useCase.getResponse(new QuestionForAiInputData(question));

        assertEquals("Thiếu nhưng vẫn chạy", result.getResponse());
    }

    @Test
    void testGetResponse_ShouldIgnoreInactiveProduct() {
        String question = "Giới thiệu sản phẩm!";
        ProductEntity product = ProductEntity.builder()
                .productName("Quần short")
                .unitPrice(new BigDecimal("159000"))
                .isActive(false) // 👈 Sản phẩm bị ẩn
                .build();

        when(productRepository.findAll()).thenReturn(List.of(product));
        when(genAiUtilBoundary.callGenAi(anyString(), eq(question)))
                .thenReturn("[] product response");
        when(chatWithAiOutputBoundary.convertToChatWithAiOutputData("[] product response"))
                .thenReturn(new ResponseFromAiOutputData("Không có sản phẩm"));

        ResponseFromAiOutputData result = useCase.getResponse(new QuestionForAiInputData(question));

        assertEquals("Không có sản phẩm", result.getResponse());
    }

    @Test
    void testGetResponse_ShouldReturnEmptyWhenStoreIsEmpty() {
        String question = "Cửa hàng gần nhất ở đâu?";
        when(storeRepository.findAll()).thenReturn(List.of());
        when(genAiUtilBoundary.callGenAi(anyString(), eq(question)))
                .thenReturn("empty store");
        when(chatWithAiOutputBoundary.convertToChatWithAiOutputData("empty store"))
                .thenReturn(new ResponseFromAiOutputData("Không tìm thấy"));

        ResponseFromAiOutputData result = useCase.getResponse(new QuestionForAiInputData(question));

        assertEquals("Không tìm thấy", result.getResponse());
    }

    @Test
    void testGetResponse_ShouldReturnEmptyWhenQuestionIsBlank() {
        String question = "    ";
        when(productRepository.findAll()).thenReturn(List.of());
        when(genAiUtilBoundary.callGenAi(anyString(), eq(question)))
                .thenReturn("empty product");
        when(chatWithAiOutputBoundary.convertToChatWithAiOutputData("empty product"))
                .thenReturn(new ResponseFromAiOutputData("Không có câu hỏi rõ ràng"));

        ResponseFromAiOutputData result = useCase.getResponse(new QuestionForAiInputData(question));

        assertEquals("Không có câu hỏi rõ ràng", result.getResponse());
    }

    @Test
    void testConvertVariantsToList_ShouldReturnEmptyList_WhenNull() throws Exception {
        Method method = ChatWithAIUseCaseInteraction.class
                .getDeclaredMethod("convertVariantsToList", List.class);
        method.setAccessible(true);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> result = (List<Map<String, Object>>) method.invoke(useCase, (Object) null);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testConvertToJson_ShouldThrowRuntimeException_WhenJsonProcessingFails() throws Exception {
        Method method = ChatWithAIUseCaseInteraction.class
                .getDeclaredMethod("convertToJson", Object.class);
        method.setAccessible(true);

        Object invalidObject = new Object() {
            private final Object inner = new Object() {
                private final Object loop = this;
            };
        };

        try {
            method.invoke(useCase, invalidObject);
            fail("Expected RuntimeException to be thrown");
        } catch (InvocationTargetException e) {
            Throwable cause = e.getCause();
            assertInstanceOf(RuntimeException.class, cause);
            assertTrue(cause.getMessage().contains("Lỗi khi chuyển đổi sang JSON"));
            assertInstanceOf(JsonProcessingException.class, cause.getCause());
        }
    }

    @Test
    void testIsRelatedToStore_ShouldReturnFalse_WhenInputIsNull() throws Exception {
        Method method = ChatWithAIUseCaseInteraction.class
                .getDeclaredMethod("isRelatedToStore", String.class);
        method.setAccessible(true);

        boolean result = (boolean) method.invoke(useCase, (Object) null);

        assertFalse(result);
    }
}
