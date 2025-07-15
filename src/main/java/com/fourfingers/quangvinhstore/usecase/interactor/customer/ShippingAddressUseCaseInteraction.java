package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ShippingAddressMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ShippingAddressRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ShippingAddressEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ShippingAddressType;
import com.fourfingers.quangvinhstore.usecase.boundary.ShippingAddressOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ShippingAddressInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListShippingAddressOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ShippingAddressUseCaseInteraction implements ShippingAddressInputBoundary {
    private final ShippingAddressRepository shippingAddressRepository;
    private final ShippingAddressOutputBoundary shippingAddressOutputBoundary;
    private final ShippingAddressMapper shippingAddressMapper;
    private final AccountRepository accountRepository;

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
                updateShippingAddressFromInput(accountEntity.getAccountId(), shippingAddressEntity, shippingAddressInputData);
                shippingAddressRepository.save(shippingAddressEntity);
            }
        } else {
            saveNewShippingAddress(accountEntity.getAccountId(), accountEntity, shippingAddressInputData);
        }

        return getShippingAddress(userDetails);
    }

    @Override
    public ListShippingAddressOutputData updateIsMainShippingAddress(UserDetails userDetails, ShippingAddressInputData shippingAddressInputData) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        if(shippingAddressInputData.getIsMain() == true ) {
            setIsMainToFalse(accountEntity.getAccountId());
        }
        Optional<ShippingAddressEntity> shippingAddressEntity = shippingAddressRepository.findById(shippingAddressInputData.getShippingAddressId());
        shippingAddressEntity.ifPresent(shippingAddressRepository::save);
        return getShippingAddress(userDetails);
    }

    private void setIsMainToFalse(Long accountId) {
        List<ShippingAddressEntity> shippingAddressEntities = shippingAddressRepository.findAllByAccount_AccountIdAndIsMain(accountId, true);
        for(ShippingAddressEntity shippingAddressEntity : shippingAddressEntities) {
            shippingAddressEntity.setIsMain(false);
            shippingAddressRepository.save(shippingAddressEntity);
        }
    }

    void saveNewShippingAddress(Long accountId, AccountEntity accountEntity, ShippingAddressInputData inputData) {
        ShippingAddressEntity newEntity = new ShippingAddressEntity();
        newEntity.setAccount(accountEntity);
        updateShippingAddressFromInput(accountId, newEntity, inputData);

        if (inputData.getShippingAddressId() != null) {
            newEntity.setShippingAddressId(inputData.getShippingAddressId());
        }

        shippingAddressRepository.save(newEntity);
    }

    private void updateShippingAddressFromInput(Long accountId, ShippingAddressEntity entity, ShippingAddressInputData inputData) {
        entity.setAddress(inputData.getAddress());
        entity.setExactAddress(inputData.getExactAddress());
        entity.setName(inputData.getName());
        entity.setPhoneNumber(inputData.getPhoneNumber());
        if(inputData.getIsMain() == true) {
            setIsMainToFalse(accountId);
            entity.setIsMain(true);
        }
        switch (entity.getType().toString().toUpperCase()) {
            case "HOME":
                entity.setType(ShippingAddressType.HOME);
                break;
            case "WORK":
                entity.setType(ShippingAddressType.WORK);
                break;
            default:
                entity.setType(ShippingAddressType.OTHER);
                break;
        }
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
