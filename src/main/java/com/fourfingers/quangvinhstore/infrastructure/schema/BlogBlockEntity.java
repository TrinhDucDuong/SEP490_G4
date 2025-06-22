package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table (name = "blog_blocks")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BlogBlockEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "block_id")
    private UUID blockId;

    @ManyToOne
    @JoinColumn(name = "blog_id", referencedColumnName = "blog_id", nullable = false)
    private BlogEntity blog;

    @Column(name = "block_header", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String blockHeader;

    @Column(name = "block_content", columnDefinition = "TEXT")
    private String blockContent;

    @ManyToOne
    @JoinColumn(name = "block_parent_id", referencedColumnName = "block_id")
    private BlogBlockEntity parentBlock;

    @OneToMany(mappedBy = "parentBlock", fetch = FetchType.EAGER)
    private List<BlogBlockEntity> childrenBlocks;
}
