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

    @Override
    public ListShippingAddressOutputData getShippingAddress(UserDetails userDetails) {
        Long accountId = ((AccountEntity) userDetails).getAccountId();
        List<ShippingAddressEntity> entities = shippingAddressRepository.findAllByAccount_AccountIdAndIsActive(accountId, true);
        return shippingAddressOutputBoundary.convertToListShippingAddressOutputData(
                entities.stream().map(shippingAddressMapper::toModel).toList()
        );
    }

    @Override
    public ListShippingAddressOutputData saveShippingAddress(UserDetails userDetails, ShippingAddressInputData inputData) {
        AccountEntity account = (AccountEntity) userDetails;
        Long accountId = account.getAccountId();

        if (inputData.getShippingAddressId() != null) {
            shippingAddressRepository
                    .findByAccount_AccountIdAndShippingAddressId(accountId, inputData.getShippingAddressId())
                    .ifPresent(entity -> {
                        updateShippingAddressFromInput(accountId, entity, inputData);
                        shippingAddressRepository.save(entity);
                    });
        } else {
            saveNewShippingAddress(account, inputData);
        }

        return getShippingAddress(userDetails);
    }

    @Override
    public ListShippingAddressOutputData updateIsMainShippingAddress(UserDetails userDetails, Long shippingAddressId) {
        AccountEntity account = (AccountEntity) userDetails;
        Long accountId = account.getAccountId();

        if(shippingAddressId == null) {
            throw new RuntimeException("Shipping address id is null");
        }

        setAllIsMainToFalse(accountId);

        shippingAddressRepository.findById(shippingAddressId)
                .ifPresent(entity -> {
                    entity.setIsMain(true);
                    shippingAddressRepository.save(entity);
                });

        return getShippingAddress(userDetails);
    }

    private void setAllIsMainToFalse(Long accountId) {
        List<ShippingAddressEntity> entities = shippingAddressRepository.findAllByAccount_AccountIdAndIsMain(accountId, true);
        entities.forEach(entity -> {
            entity.setIsMain(false);
            shippingAddressRepository.save(entity);
        });
    }

    private void saveNewShippingAddress(AccountEntity account, ShippingAddressInputData inputData) {
        ShippingAddressEntity newEntity = new ShippingAddressEntity();
        newEntity.setAccount(account);

        if (inputData.getShippingAddressId() != null) {
            newEntity.setShippingAddressId(inputData.getShippingAddressId());
        }

        updateShippingAddressFromInput(account.getAccountId(), newEntity, inputData);
        shippingAddressRepository.save(newEntity);
    }

    private void updateShippingAddressFromInput(Long accountId, ShippingAddressEntity entity, ShippingAddressInputData inputData) {
        entity.setAddress(inputData.getAddress());
        entity.setExactAddress(inputData.getExactAddress());
        entity.setName(inputData.getName());
        entity.setPhoneNumber(inputData.getPhoneNumber());
        entity.setIsActive(true);

        if (Boolean.TRUE.equals(inputData.getIsMain())) {
            setAllIsMainToFalse(accountId);
            entity.setIsMain(true);
        }

        String typeStr = inputData.getType();
        ShippingAddressType type = parseShippingAddressType(typeStr);
        entity.setType(type);
    }

    private ShippingAddressType parseShippingAddressType(String typeStr) {
        if (typeStr == null) return ShippingAddressType.OTHER;
        try {
            return ShippingAddressType.valueOf(typeStr.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ShippingAddressType.OTHER;
        }
    }

    @Override
    public ListShippingAddressOutputData deleteShippingAddress(UserDetails userDetails, Long shippingAddressId) {
        AccountEntity account = (AccountEntity) userDetails;
        shippingAddressRepository.findByAccount_AccountIdAndShippingAddressId(account.getAccountId(), shippingAddressId)
                .ifPresent(address -> {
                    address.setIsActive(false);
                    shippingAddressRepository.save(address);
                });
        return getShippingAddress(userDetails);
    }
}