package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "blog_tags")
public class BlogTagEntity {
    @Id
    @Column(name = "tag_name")
    private String tagName;

    @ManyToMany(mappedBy = "blogTags")
    private List<BlogEntity> blogs;
}
