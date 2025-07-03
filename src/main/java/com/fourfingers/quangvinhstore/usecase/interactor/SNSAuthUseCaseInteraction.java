package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.adapter.exception.AccountNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.Authority;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AuthorityMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.AuthorityRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProfileRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProfileEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.JwtUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.SNSAuthInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSAuthInputData;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SNSAuthUseCaseInteraction implements SNSAuthInputBoundary {
    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final AuthorityRepository authorityRepository;
    private final AuthenticationOutputBoundary authenticationOutputBoundary;
    private final JwtUtilBoundary jwtUtil;
    private final AuthorityMapper authorityMapper;
    private final JavaMailSender mailSender;
    private final ProfileRepository profileRepository;
    private final ImageRepository imageRepository;

    @Override
    @Transactional
    public AuthenticationOutputData performGoogleAuthentication(SNSAuthInputData data) {
        OAuth2AuthenticationToken token = data.getToken();
        String email = token.getPrincipal().getAttributes().get("email").toString();
        String name = token.getPrincipal().getAttributes().get("name").toString();
        String picture = token.getPrincipal().getAttributes().get("picture").toString();
        AccountEntity accountEntity = accountRepository.findByEmail(email).orElse(null);
        if (accountEntity == null) {
            AccountEntity newAccount = new AccountEntity();
            newAccount.setEmail(email);
            newAccount.setUsername(email.substring(0, 15));
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            newAccount.setPassword(passwordEncoder.encode(email+name));
            newAccount.setActive(true);
            newAccount.setCreatedAt(LocalDateTime.now());

            AuthorityEntity authority = authorityRepository.findById("CUSTOMER")
                    .orElseGet(() -> {
                        AuthorityEntity newAuthority = new AuthorityEntity();
                        newAuthority.setAuthorityName("CUSTOMER");
                        return authorityRepository.save(newAuthority);
                    });

            newAccount.setAuthorities(List.of(authority));

            accountRepository.save(newAccount);
            saveDefaultProfile(newAccount, name, picture);
        }
        accountEntity = accountRepository.findByEmail(email).orElseThrow(() -> new AccountNotFoundException("Login via Google failed!"));

        String generateToken = jwtUtil.generateToken(accountEntity);
        Account userAccount = accountMapper.toAccount(accountEntity);
        return authenticationOutputBoundary.convertToOutputData(userAccount, generateToken);
    }

    private void saveDefaultProfile(AccountEntity accountEntity, String name, String picture) {
        ProfileEntity needToCreatedProfile = ProfileEntity.builder()
                .account(accountEntity)
                .firstName("name")
                .build();
        ProfileEntity savedProfile = profileRepository.save(needToCreatedProfile);
        savedDefaultImage(savedProfile, picture);
    }

    private void savedDefaultImage(ProfileEntity savedProfile, String picture) {
        ImageEntity needToCreatedImage = ImageEntity.builder()
                .imageUrl("picture")
                .imageType(ImageType.PROFILE)
                .isActive(true)
                .referenceId(savedProfile.getProfileId())
                .build();
        imageRepository.save(needToCreatedImage);
    }

    @Override
    public AuthenticationOutputData performFacebookAuthentication(SNSAuthInputData data) {
//        AccountEntity accountEntity = accountRepository.findByFacebookId(data.getFacebookId()).orElse(null);
//        if (accountEntity == null) {
//            AccountEntity newAccount = new AccountEntity();
//            newAccount.setFacebookId(data.getFacebookId());
//            //TODO: Set default profile + image + created at + is active
//
//            AuthorityEntity authority = authorityRepository.findById("Customer")
//                    .orElseGet(() -> {
//                        AuthorityEntity newAuthority = new AuthorityEntity();
//                        newAuthority.setAuthorityName("Customer");
//                        return authorityRepository.save(newAuthority);
//                    });
//
//            newAccount.setAuthorities(List.of(authority));
//
//            accountRepository.save(newAccount);
//        }
//        accountEntity = accountRepository.findByFacebookId(data.getFacebookId()).orElseThrow(() -> new AccountNotFoundException("Login via Facebook failed!"));
//
//        String token = jwtUtil.generateToken(accountEntity);
//        List<Authority> authorities = List.of(
//                accountEntity.getAuthorities()
//                        .stream()
//                        .map((authorityEntity) -> authorityMapper.toModel((AuthorityEntity) authorityEntity))
//                        .toArray(Authority[]::new)
//        );
//        Account userAccount = accountMapper.toAccount(accountEntity);
////        userAccount.setAuthorities(authorities);
//        return authenticationOutputBoundary.convertToOutputData(userAccount, token);
        return null;
    }

    public void resetPassword(String contact) throws AccountNotFoundException {
        try{
            AccountEntity accountEntity = accountRepository.findByEmail(contact)
                    .orElseThrow(() -> new AccountNotFoundException("Email không tồn tại"));

            String resetToken = UUID.randomUUID().toString();
            accountEntity.setResetToken(resetToken);
            accountRepository.save(accountEntity);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(contact);
            helper.setSubject("Xác nhận đặt lại mật khẩu");
            helper.setText(mailUIresetPassword(contact, resetToken), true); // true = HTML

            mailSender.send(message);
        } catch (Exception e) {
            throw new AccountNotFoundException("Can not send email to " + contact, e);
        }
    }

    public void processResetPassword(String contact, String token) throws AccountNotFoundException {
        AccountEntity accountEntity = accountRepository.findByEmailAndResetToken(contact, token)
                .orElseThrow(() -> new AccountNotFoundException("Liên kết không hợp lệ hoặc đã hết hạn"));

        String tempPassword = generateTemporaryPassword();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        accountEntity.setPassword(passwordEncoder.encode(tempPassword));
        accountEntity.setResetToken(null);
        accountRepository.save(accountEntity);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(contact);
        message.setSubject("Mật khẩu tạm thời");
        message.setText("Mật khẩu tạm thời của bạn là: " + tempPassword +
                "\nVui lòng đăng nhập và đổi mật khẩu ngay.");
        mailSender.send(message);
    }

    private String generateTemporaryPassword() {
        return "temp" + 100000 + new Random().nextInt(999999);
    }

    private String mailUIresetPassword(String contact, String token) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "  <style>\n" +
                "    .button {\n" +
                "      background-color: #4CAF50;\n" +
                "      color: white;\n" +
                "      padding: 10px 20px;\n" +
                "      text-align: center;\n" +
                "      text-decoration: none;\n" +
                "      display: inline-block;\n" +
                "      font-size: 16px;\n" +
                "      margin: 10px 0;\n" +
                "      border-radius: 5px;\n" +
                "    }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <p>Quang Vinh Authentic vừa nhận được yêu cầu cấp mật khẩu mới cho bạn!</p>\n" +
                "  <p>Nếu không phải bạn, vui lòng bỏ qua email!</p>\n" +
                "  <p>Để nhận mật khẩu mới, vui lòng xác nhận:</p>\n" +
                "  <a href=\"http://localhost:9999/auth/social/reset?contact=" + contact + "&token=" + token + "\" class=\"button\">Tôi muốn nhận mật khẩu mới</a>\n" +
                "</body>\n" +
                "</html>";
    }

}
