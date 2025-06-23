package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "feedbacks")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class FeedbackEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;

    @Column(name = "feedback_title", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String feedbackTitle;

    @Column(name = "feedback_content", columnDefinition = "TEXT", nullable = false)
    private String feedbackContent;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "account_id")
    private AccountEntity createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_active", nullable = false, columnDefinition = "BIT DEFAULT 1")
    private Boolean isActive;
}
