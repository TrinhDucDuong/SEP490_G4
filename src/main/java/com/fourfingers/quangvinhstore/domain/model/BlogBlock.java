package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BlogBlock {
    private Long blockHeader;
    private String blockContent;
    private List<BlogBlock> childrenBlocks;
}
