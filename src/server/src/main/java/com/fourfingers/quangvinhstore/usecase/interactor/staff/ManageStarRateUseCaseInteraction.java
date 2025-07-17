package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.StarRate;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.StarRateStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.StarRateRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StarRateManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StarRateManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListStarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ReplyStarRateInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.UpdateStarRateInputData;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStarRateUseCaseInteraction implements StarRateManagementInputBoundary {
    private final StarRateRepository starRateRepository;
    private final StarRateStaffMapper starRateStaffMapper;
    private final StarRateManagementOutputBoundary starRateManageMentOutputBoundary;

    @Override
    @Transactional
    public ListStarRateOutputData getAll() {
        return starRateManageMentOutputBoundary.convertToListStarRateOutputData(
                starRateRepository.findAll()
                        .stream()
                        .map(starRateEntity -> {
                            StarRate starRate = starRateStaffMapper.toModel(starRateEntity);
                            starRate.getProductVariant().setProductName(
                                    starRateEntity.getProductVariant().getProduct().getProductName()
                            );
                            return starRate;
                        })
                        .toList()
        );
    }

    @Override
    @Transactional
    public StarRateOutputData reply(ReplyStarRateInputData replyStarRateInputData, UserDetails userDetails) {
        StarRateEntity replyTo = starRateRepository.findById(replyStarRateInputData.getReplyId()).orElseThrow(
                () -> new EntityNotFoundException("Star rate not found")
        );
        ProductVariantEntity variantHavingStarRate = replyTo.getProductVariant();
        AccountEntity performReplyingAccount = (AccountEntity) userDetails;
        StarRateEntity staffReplyStarRateEntity = StarRateEntity.builder()
                .productVariant(variantHavingStarRate)
                .account(performReplyingAccount)
                .createdAt(LocalDateTime.now())
                .replyTo(replyTo)
                .comment(replyStarRateInputData.getComment())
                .build();
        starRateRepository.save(staffReplyStarRateEntity);
        List<StarRate> staffReplies = getStaffReply(replyTo);
        return starRateManageMentOutputBoundary.convertToStarRateOutputData(starRateStaffMapper
                .toModel(replyTo), staffReplies);
    }

    @Override
    @Transactional
    public StarRateOutputData get(String id) {
        StarRateEntity starRateEntity = starRateRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException("Star rate not found")
        );
        List<StarRate> staffReplies = getStaffReply(starRateEntity);
        StarRate starRate = starRateStaffMapper.toModel(starRateEntity);
        starRate.getProductVariant().setProductName(
                starRateEntity.getProductVariant().getProduct().getProductName()
        );
        return starRateManageMentOutputBoundary.convertToStarRateOutputData(starRate, staffReplies);
    }

    @Override
    public StarRateOutputData disable(String id, UserDetails userDetails) {
        StarRateEntity needToDisableStarRateEntity = starRateRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException("Star rate not found")
        );
        AccountEntity performDisableAccount = (AccountEntity) userDetails;
        needToDisableStarRateEntity.setActive(false);
        needToDisableStarRateEntity.setUpdatedAt(LocalDateTime.now());
        needToDisableStarRateEntity.setUpdatedBy(performDisableAccount);
        starRateRepository.save(needToDisableStarRateEntity);
        return starRateManageMentOutputBoundary.convertToStarRateOutputData(starRateStaffMapper
                .toModel(needToDisableStarRateEntity), null);
    }

    @Override
    public StarRateOutputData unDisable(String id, UserDetails userDetails) {
        StarRateEntity needToDisableStarRateEntity = starRateRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException("Star rate not found")
        );
        AccountEntity performDisableAccount = (AccountEntity) userDetails;
        needToDisableStarRateEntity.setActive(true);
        needToDisableStarRateEntity.setUpdatedAt(LocalDateTime.now());
        needToDisableStarRateEntity.setUpdatedBy(performDisableAccount);
        starRateRepository.save(needToDisableStarRateEntity);
        return starRateManageMentOutputBoundary.convertToStarRateOutputData(starRateStaffMapper
                .toModel(needToDisableStarRateEntity), null);
    }

    @Override
    public StarRateOutputData update(String id, UserDetails userDetails, UpdateStarRateInputData updateStarRateInputData) {
        StarRateEntity needToUpdateStarRateEntity = starRateRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException("Star rate not found")
        );
        AccountEntity performUpdateAccount = (AccountEntity) userDetails;
        needToUpdateStarRateEntity.setComment(updateStarRateInputData.getComment());
        needToUpdateStarRateEntity.setUpdatedAt(LocalDateTime.now());
        needToUpdateStarRateEntity.setUpdatedBy(performUpdateAccount);
        starRateRepository.save(needToUpdateStarRateEntity);
        return starRateManageMentOutputBoundary.convertToStarRateOutputData(
                starRateStaffMapper.toModel(needToUpdateStarRateEntity), null
        );
    }

    private List<StarRate> getStaffReply(StarRateEntity starRateEntity) {
        return starRateEntity.getStaffReplies().stream().map(starRateStaffMapper::toModel).toList();
    }
}
