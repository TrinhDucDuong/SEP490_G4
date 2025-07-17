package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.CartMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.CartDetailsRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductVariantRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.CartDetailsEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ProductSize;
import com.fourfingers.quangvinhstore.usecase.boundary.CartInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.CartOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.CartInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCartDetailsOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CartUseCaseInteraction implements CartInputBoundary {
    private final CartMapper cartMapper;
    private final CartDetailsRepository cartDetailsRepository;
    private final ProductVariantRepository productVariantRepository;
    private final AccountRepository accountRepository;
    private final CartOutputBoundary cartOutputBoundary;

    @Override
    public ListCartDetailsOutputData getCart(Long accountId) {
        return cartOutputBoundary.convertToListCartDetailsOutputData(
                        cartDetailsRepository.findByAccount_AccountId(accountId)
                                .stream().map(cartMapper::toCartDetails)
                                .peek(cartDetails -> {
                                    if(cartDetails.getProductVariant() != null) {
                                        cartDetails.getProductVariant().setStores(null);
                                    }
                                })
                                .toList()
        );
    }

    @Override
    @Transactional
    public ListCartDetailsOutputData addToCart(CartInputData cartInputData) throws IllegalArgumentException {
        if(cartInputData.getQuantity() <= 0) {
            throw new IllegalArgumentException("Không thể thêm số lượng " + cartInputData.getQuantity() + " vào giỏ hàng");
        }
        Optional<ProductVariantEntity> productVariantEntity = productVariantRepository
                                                            .findByProduct_ProductIdAndColor_ColorHexAndProductSize(
                                                                    cartInputData.getProductId(),
                                                                    cartInputData.getColorHexCode(),
                                                                    ProductSize.valueOf(cartInputData.getSizeCode())
                                                            );
        if(productVariantEntity.isEmpty()){
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với kích cỡ và màu sắc như bạn chọn");
        } else {
            Long remainingQuantity = productVariantEntity.get().getQuantity();
            if(remainingQuantity < cartInputData.getQuantity()){
                throw new IllegalArgumentException("Không đủ số lượng sản phẩm mong muốn! Hiện còn: " + remainingQuantity);
            } else {
                Optional<CartDetailsEntity> cartDetailsEntity = cartDetailsRepository
                                                            .findByAccount_AccountIdAndProductVariant_ProductVariantId(
                                                                    cartInputData.getAccountId(),
                                                                    productVariantEntity.get().getProductVariantId()
                                                            );
                if(cartDetailsEntity.isPresent()){
                    CartDetailsEntity existingCartDetails = cartDetailsEntity.get();
                    existingCartDetails.setQuantity((short) (existingCartDetails.getQuantity() + cartInputData.getQuantity()));
                    cartDetailsRepository.save(existingCartDetails);
                }
                else {
                    CartDetailsEntity newCartDetails = new CartDetailsEntity(
                            null,
                            accountRepository.findById(cartInputData.getAccountId()).get(),
                            productVariantEntity.get(),
                            cartInputData.getQuantity()
                    );
                    cartDetailsRepository.save(newCartDetails);
                }
            }
        }

        return getCart(cartInputData.getAccountId());
    }

    @Override
    public ListCartDetailsOutputData removeFromCart(CartInputData cartInputData) throws IllegalArgumentException {
        if(cartInputData.getQuantity() <= 0) {
            throw new IllegalArgumentException("Không thể giảm số lượng " + cartInputData.getQuantity() + " từ giỏ hàng");
        }
        Optional<ProductVariantEntity> productVariantEntity = productVariantRepository
                .findByProduct_ProductIdAndColor_ColorHexAndProductSize(
                        cartInputData.getProductId(),
                        cartInputData.getColorHexCode(),
                        ProductSize.valueOf(cartInputData.getSizeCode())
                );
        if(productVariantEntity.isEmpty()){
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với kích cỡ và màu sắc như bạn chọn");
        } else {
            Optional<CartDetailsEntity> cartDetailsEntity = cartDetailsRepository
                    .findByAccount_AccountIdAndProductVariant_ProductVariantId(
                            cartInputData.getAccountId(),
                            productVariantEntity.get().getProductVariantId()
                    );
            if(cartDetailsEntity.isPresent()){
                short afterSubtractQuantity = (short) (cartDetailsEntity.get().getQuantity() - cartInputData.getQuantity());
                if(afterSubtractQuantity <= 0){
                    cartDetailsRepository.delete(cartDetailsEntity.get());
                } else {
                    CartDetailsEntity existingCartDetails = cartDetailsEntity.get();
                    existingCartDetails.setQuantity(afterSubtractQuantity);
                    cartDetailsRepository.save(existingCartDetails);
                }
            } else {
                throw new IllegalArgumentException("Không tìm thấy sản phầm này trong giỏ hàng của bạn");
            }
        }

        return getCart(cartInputData.getAccountId());
    }
}
