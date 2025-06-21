package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "comments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CommentEntity {
    @Id
    @Column(name = "comment_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID commentId;

    @Column(name = "content", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "product_id" , nullable = false)
    private ProductEntity product;

    @ManyToOne
    @JoinColumn(name = "account_id" , nullable = false)
    private AccountEntity account;
}
