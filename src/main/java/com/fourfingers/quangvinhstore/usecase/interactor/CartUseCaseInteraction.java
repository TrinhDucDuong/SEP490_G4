package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.CartMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.CartDetailsRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductVariantRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.CartDetailsEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
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
                                .stream().map(cartMapper::toCartDetails).toList()
        );
    }

    @Override
    @Transactional
    public ListCartDetailsOutputData addToCart(CartInputData cartInputData) throws IllegalArgumentException {
        Optional<ProductVariantEntity> productVariantEntity = productVariantRepository
                                                            .findByProduct_ProductIdAndColor_ColorHexAndProductSize(
                                                                    cartInputData.getProductId(),
                                                                    cartInputData.getColorHexCode(),
                                                                    cartInputData.getSizeCode()
                                                            );
        if(productVariantEntity.isEmpty()){
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với kích cỡ và màu sắc như bạn chọn");
        } else {
            Long remainingQuantity = productVariantEntity.get().getQuantity();
            if(remainingQuantity < cartInputData.getQuantity()){
                throw new IllegalArgumentException("Không đủ số lượng sản phẩm mong muốn! Hiện còn: " + remainingQuantity);
            } else {
                if(cartInputData.getCartDetailsId() != null) {
                    Optional<CartDetailsEntity> existingCart = cartDetailsRepository.findById(cartInputData.getCartDetailsId());
                    if(existingCart.isPresent()){
                        CartDetailsEntity cartDetails = existingCart.get();
                        cartDetails.setQuantity((short) (cartDetails.getQuantity() + cartInputData.getQuantity()));
                        cartDetailsRepository.save(cartDetails);
                    }
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
        if(cartInputData.getCartDetailsId() != null) {
            Optional<CartDetailsEntity> existingCart = cartDetailsRepository.findByCartDetailsId(cartInputData.getCartDetailsId());
            if(existingCart.isPresent()){
                CartDetailsEntity cartDetails = existingCart.get();
                cartDetails.setQuantity(cartInputData.getQuantity());
                cartDetailsRepository.save(cartDetails);
                if(cartDetails.getQuantity() == 0) {
                    cartDetailsRepository.delete(cartDetails);
                }
            }
        }

        return getCart(cartInputData.getAccountId());
    }
}
