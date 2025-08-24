package com.fourfingers.quangvinhstore.adapter.rest;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller handling email-related operations for the UI.
 * Mapped to the "/emailUI" endpoint.
 *
 * @author DuongTDHE171824
 */
@RestController
@RequestMapping("/emailUI")
public class MailUIController {

    private final String htmlContent = """
                <!DOCTYPE html>
                <html>
                <body style="margin:0; padding:0; background-color:#f0f2f5; font-family:Arial,sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:40px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
                          <!-- Logo -->
                          <tr>
                            <td align="center" style="padding-bottom:20px;">
                              <img src="https://drive.google.com/file/d/1ebkFjMqm-Wq_m_pcSQGhNwI7bP99_i5S/view" alt="Quang Vinh Authentic" width="120"/>
                            </td>
                          </tr>

                          <!-- Câu hỏi -->
                          <tr>
                            <td align="center" style="padding-bottom:20px;">
                              <h2 style="color:#333;">Bạn có xác nhận đăng ký  tài khoản để tích điểm Loyalty<br>
                                với <span style="color:#d4af37;">Quang Vinh Authentic</span> không?
                              </h2>
                            </td>
                          </tr>

                          <!-- Câu slogan -->
                          <tr>
                            <td align="center" style="padding-bottom:30px;">
                              <p style="color:#666;font-size:16px;">Khách hàng thân thiết – Ưu đãi vượt mong đợi 💎</p>
                            </td>
                          </tr>

                          <!-- Nút xác nhận -->
                          <tr>
                            <td align="center">
                              <a href="https://quangvinh-authentic.vn/loyalty-confirm?accept=true"
                                 style="background:#d4af37; color:white; padding:14px 28px; text-decoration:none;
                                        border-radius:6px; font-weight:bold; display:inline-block;">
                                Tôi đồng ý
                              </a>
                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td align="center" style="padding-top:40px; font-size:12px; color:#999;">
                              © 2025 Quang Vinh Authentic – Tôn vinh giá trị thật
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
            """;

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends a loyalty program registration confirmation email to the specified email address.
     *
     * @param toEmail The recipient's email address
     * @return A message indicating the success or failure of the email sending operation
     */
    @GetMapping
    public String sendLoyaltyEmail(@RequestParam String toEmail) {
        try {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Xác nhận đăng ký Loyalty");
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);

            return "Email đã gửi thành công đến: " + toEmail;
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi gửi email: " + e.getMessage();
        }
    }
}
