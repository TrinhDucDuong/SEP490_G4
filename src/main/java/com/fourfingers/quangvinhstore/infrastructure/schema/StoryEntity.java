package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table (name = "stories")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StoryEntity {
    @Id
    @Column(name = "story_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storyId;

    @Column(name = "title", columnDefinition = "NVARCHAR(255)", nullable = false)
    @NotBlank(message = "Title cannot be blank")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    @NotBlank(message = "Content cannot be blank")
    private String content;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1", nullable = false)
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "account_id")
    private AccountEntity createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
