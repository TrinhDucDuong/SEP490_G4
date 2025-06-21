package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

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
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID storyId;

    @Column(name = "title", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String content;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1", nullable = false)
    private Boolean isActive;
}
