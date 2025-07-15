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

import java.util.Optional;

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

        ShippingAddressEntity shippingAddressEntity;

        if (shippingAddressInputData.getShippingAddressId() != null) {
            Optional<ShippingAddressEntity> existingEntityOpt = shippingAddressRepository
                    .findByAccount_AccountIdAndShippingAddressId(
                            accountEntity.getAccountId(),
                            shippingAddressInputData.getShippingAddressId()
                    );

            if (existingEntityOpt.isPresent()) {
                shippingAddressEntity = existingEntityOpt.get();
                updateShippingAddressFromInput(shippingAddressEntity, shippingAddressInputData);
                shippingAddressRepository.save(shippingAddressEntity);
            } else {
                saveNewShippingAddress(accountEntity, shippingAddressInputData);
            }
        } else {
            saveNewShippingAddress(accountEntity, shippingAddressInputData);
        }

        return getShippingAddress(userDetails);
    }

    void saveNewShippingAddress(AccountEntity accountEntity, ShippingAddressInputData inputData) {
        ShippingAddressEntity newEntity = new ShippingAddressEntity();
        newEntity.setAccount(accountEntity);
        updateShippingAddressFromInput(newEntity, inputData);

        if (inputData.getShippingAddressId() != null) {
            newEntity.setShippingAddressId(inputData.getShippingAddressId());
        }

        shippingAddressRepository.save(newEntity);
    }

    private void updateShippingAddressFromInput(ShippingAddressEntity entity, ShippingAddressInputData inputData) {
        entity.setAddress(inputData.getAddress());
        entity.setExactAddress(inputData.getExactAddress());
        entity.setName(inputData.getName());
        entity.setPhoneNumber(inputData.getPhoneNumber());
        entity.setMain(inputData.isMain());
    }



    @Override
    public ListShippingAddressOutputData deleteShippingAddress(UserDetails userDetails, Long shippingAddressId) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        Optional<ShippingAddressEntity> shippingAddressEntity = shippingAddressRepository
                .findByAccount_AccountIdAndShippingAddressId(
                        accountEntity.getAccountId(),
                        shippingAddressId
                );
        shippingAddressEntity.ifPresent(shippingAddressRepository::delete);
        return getShippingAddress(userDetails);
    }
}
