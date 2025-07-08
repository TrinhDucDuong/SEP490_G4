package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ShippingAddressMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ShippingAddressRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ShippingAddressEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.ShippingAddressOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ShippingAddressInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListShippingAddressOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ShippingAddressUseCaseInteraction implements ShippingAddressInputBoundary {
    private final ShippingAddressRepository shippingAddressRepository;
    private final ShippingAddressOutputBoundary shippingAddressOutputBoundary;
    private final ShippingAddressMapper shippingAddressMapper;


    @Override
    public ListShippingAddressOutputData getShippingAddress(UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        return shippingAddressOutputBoundary.convertToListShippingAddressOutputData(
                shippingAddressRepository.findAllByAccount_AccountId(accountEntity.getAccountId())
                        .stream()
                        .map(shippingAddressMapper::toModel)
                        .toList()
        );
    }

    @Override
    public ListShippingAddressOutputData saveShippingAddress(UserDetails userDetails, ShippingAddressInputData shippingAddressInputData) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        ShippingAddressEntity shippingAddressEntity = shippingAddressRepository
                                                            .findByAccount_AccountIdAndShippingAddressId(
                                                                    accountEntity.getAccountId(),
                                                                    shippingAddressInputData.getShippingAddressId()
                                                            );
        if(shippingAddressEntity != null) {
            shippingAddressEntity = new ShippingAddressEntity();
            shippingAddressEntity.setAccount(accountEntity);
            shippingAddressEntity.setShippingAddressId(shippingAddressInputData.getShippingAddressId());
            shippingAddressEntity.setAddress(shippingAddressInputData.getAddress());
            shippingAddressEntity.setExactAddress(shippingAddressInputData.getExactAddress());
            shippingAddressEntity.setName(shippingAddressInputData.getName());
            shippingAddressEntity.setPhoneNumber(shippingAddressInputData.getPhoneNumber());
            shippingAddressEntity.setMain(shippingAddressInputData.isMain());
            shippingAddressRepository.save(shippingAddressEntity);
        }
        return getShippingAddress(userDetails);
    }

    @Override
    public ListShippingAddressOutputData deleteShippingAddress(UserDetails userDetails, Long shippingAddressId) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        ShippingAddressEntity shippingAddressEntity = shippingAddressRepository
                .findByAccount_AccountIdAndShippingAddressId(
                        accountEntity.getAccountId(),
                        shippingAddressId
                );
        if(shippingAddressEntity != null) {
            shippingAddressRepository.delete(shippingAddressEntity);
        }
        return getShippingAddress(userDetails);
    }
}
