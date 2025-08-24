package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.adapter.exception.AccountNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.SNS;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.SNSMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.SNSRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.SNSEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.SNSManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.SNSManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.SNSInputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.ListSNSOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/**
 * Implementation of SNS management use case interactions.
 * Handles CRUD operations for SNS entities with authentication.
 *
 * @author DuongTDHE171824
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageSNSUseCaseInteraction implements SNSManagementInputBoundary {
    private final SNSRepository snsRepository;
    private final SNSMapper snsMapper;
    private final SNSManagementOutputBoundary snsManagementOutputBoundary;
    private final AccountRepository accountRepository;


    /**
     * Retrieves all SNS entries from the system.
     *
     * @param userDetails the authenticated user details
     * @return ListSNSOutputData containing all SNS entries
     * @throws RuntimeException if user is not authenticated
     * @author DuongTDHE171824
     */
    @Override
    public ListSNSOutputData getAllSNSs(UserDetails userDetails) {
        if (!validateAuthentication(userDetails)) {
            throw new RuntimeException("User not authenticated");
        }
        return snsManagementOutputBoundary.convertToListSNSOutputData(
                snsRepository.findAll()
                        .stream()
                        .map(snsMapper::toSNS)
                        .toList()
        );
    }

    /**
     * Saves a new SNS entry to the system.
     *
     * @param snsInputData the SNS data to save
     * @param userDetails  the authenticated user details
     * @return SNSOutputData of the saved SNS
     * @throws RuntimeException if user is not authenticated
     * @author DuongTDHE171824
     */
    @Override
    public SNSOutputData save(SNSInputData snsInputData, UserDetails userDetails) {
        if (!validateAuthentication(userDetails)) {
            throw new RuntimeException("User not authenticated");
        }
        SNSEntity snsEntity = SNSEntity.builder()
                .snsId(snsInputData.getSnsId())
                .snsName(snsInputData.getSnsName())
                .snsUrl(snsInputData.getSnsUrl())
                .snsChatUrl(snsInputData.getSnsChatUrl())
                .isActive(true)
                .build();
        SNS savedSNS = snsMapper.toSNS(snsRepository.save(snsEntity));
        return snsManagementOutputBoundary.convertToSNSOutputData(savedSNS);
    }

    /**
     * Retrieves a specific SNS entry by ID.
     *
     * @param id          the ID of the SNS to retrieve
     * @param userDetails the authenticated user details
     * @return SNSOutputData of the requested SNS
     * @throws AccountNotFoundException if SNS is not found
     * @throws RuntimeException         if user is not authenticated or ID is invalid
     * @author DuongTDHE171824
     */
    @Override
    public SNSOutputData getSNS(Long id, UserDetails userDetails) throws AccountNotFoundException {
        if (!validateAuthentication(userDetails)) {
            throw new RuntimeException("User not authenticated");
        }
        try {
            SNSEntity snsEntity = snsRepository.findById(id).orElseThrow(
                    () -> new AccountNotFoundException("SNS not found")
            );
            return snsManagementOutputBoundary.convertToSNSOutputData(
                    snsMapper.toSNS(snsEntity)
            );
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid SNS id");
        }
    }

    /**
     * Soft deletes an SNS entry by setting it as inactive.
     *
     * @param id          the ID of the SNS to delete
     * @param userDetails the authenticated user details
     * @return SNSOutputData of the deleted SNS
     * @throws RuntimeException         if user is not authenticated or ID is invalid
     * @throws AccountNotFoundException if SNS is not found
     * @author DuongTDHE171824
     */
    @Override
    public SNSOutputData delete(Long id, UserDetails userDetails) {
        if (!validateAuthentication(userDetails)) {
            throw new RuntimeException("User not authenticated");
        }
        try {
            SNSEntity snsEntity = snsRepository.findById(id).orElseThrow(
                    () -> new AccountNotFoundException("SNS not found")
            );
            snsEntity.setIsActive(false);
            return snsManagementOutputBoundary.convertToSNSOutputData(
                snsMapper.toSNS(snsRepository.save(snsEntity))
            );
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid SNS id");
        }
    }

    /**
     * Validates if the user has proper authentication and authorization.
     * Currently returns true for testing purposes.
     *
     * @param userDetails the user details to validate
     * @return true if authenticated, false otherwise
     * @author DuongTDHE171824
     */
    private boolean validateAuthentication(UserDetails userDetails) {
//        if (userDetails == null) {
//            return false;
//        }
//        AccountEntity accountEntity = accountRepository.findByUsername(userDetails.getUsername()).orElse(null);
//        return accountEntity != null && accountEntity.getAuthorities().contains("ADMINISTRATOR");

        return true; // ko phan quyen de test
    }
}
