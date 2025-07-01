package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sns")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SNSEntity {
    @Id
    @Column(name = "sns_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long snsId;

    @Column(name = "sns_name", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String snsName;

    @Column(name = "sns_url", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String snsUrl;

    @Column(name = "sns_chat_url", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String snsChatUrl;

    @Column(name = "is_active", columnDefinition = "boolean default true")
    private boolean isActive;
}
