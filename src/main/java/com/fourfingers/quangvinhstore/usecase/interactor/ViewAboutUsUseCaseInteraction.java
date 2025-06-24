package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Store;
import com.fourfingers.quangvinhstore.domain.model.Story;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.StoreMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.StoryMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoryRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.AboutUsInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.AboutUsOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.aboutus.AboutUsOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ViewAboutUsUseCaseInteraction implements AboutUsInputBoundary {
    private final AboutUsOutputBoundary aboutUsOutputBoundary;
    private final StoreRepository storeRepository;
    private final StoryRepository storyRepository;
    private final StoreMapper storeMapper;
    private final StoryMapper storyMapper;
    @Override
    public AboutUsOutputData showInformation() {
        List<Store> stores = List.of(storeRepository.findAll()
                .stream()
                .map(storeMapper::toModel)
                .toArray(Store[]::new)
        );
        List<Story> stories = List.of(storyRepository.findAll()
                .stream()
                .map(storyMapper::toStory)
                .toArray(Story[]::new)
        );
        return aboutUsOutputBoundary.convertToOutputData(stores, stories);
    }
}
