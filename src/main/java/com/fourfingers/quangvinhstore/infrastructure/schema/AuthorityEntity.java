package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Entity
@Table(name = "authorities")
public class AuthorityEntity implements GrantedAuthority {
    @Id
    @Column(name = "authority_name")
    private String authorityName;

    @ManyToMany(mappedBy = "authorities")
    private List<AccountEntity> accounts;
    @Override
    public String getAuthority() {
        return "";
    }
}
