package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.infrastructure.repository.BlogRepository;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.BlogUseCaseInteraction;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class BlogUseCaseInteractionTest {
    @InjectMocks
    private BlogUseCaseInteraction useCase;

    @Mock
    private BlogRepository blogRepository;
}
