//package com.fourfingers.quangvinhstore.infrastructure.repository;
//
//import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
//import lombok.RequiredArgsConstructor;
//import org.junit.jupiter.api.Assertions;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.dao.DataIntegrityViolationException;
//import org.springframework.test.context.TestPropertySource;
//
//import java.util.Optional;
//
//@DataJpaTest
//@TestPropertySource(locations = "classpath:application-test.properties")
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//@RequiredArgsConstructor(onConstructor_ = {@Autowired})
//public class AccountRepositoryTest {
//    private final AccountRepository accountRepository;
//
//    @Test
//    @DisplayName("findByUsername should return correct account")
//    public void findByUserNameShouldReturnCorrectAccount() {
//        AccountEntity accountEntity = AccountEntity.builder()
//                .username("llbigcat")
//                .password("Long2203@@")
//                .email("luulong@gmail.com")
//                .isActive(true)
//                .build();
//        accountRepository.save(accountEntity);
//        Optional<AccountEntity> result = accountRepository.findByUsername("llbigcat");
//        assert(result.isPresent());
//        assert(result.get().getUsername().equals("llbigcat"));
//    }
//
//    @Test
//    @DisplayName("save Account that contains not null field is null")
//    public void saveShouldReturnNullWhenAccountIsNull() {
//        AccountEntity accountEntity = AccountEntity.builder()
//                .username("llbigcat")
//                .email("luulong@gmail.com")
//                .isActive(true)
//                .build();
//        Assertions.assertThrows(DataIntegrityViolationException .class, () -> {
//            accountRepository.save(accountEntity);
////            accountRepository.flush();
//        });
//    }
//}
