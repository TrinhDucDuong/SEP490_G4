package com.fourfingers.quangvinhstore.infrastructure.schema;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "username", unique = true, nullable = false, columnDefinition = "CHAR(15)")
    private String username;

    @Column(name = "email", unique = true)
    private String email;

    @JoinColumn(name = "facebook_id")
    private String facebookId;

    @Column(name = "password", nullable = false, length = 68)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private AccountEntity createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private AccountEntity updatedBy;

    @Column(name = "is_active", columnDefinition = "boolean default true")
    private boolean isActive;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "accounts_authorities_mapping",
            joinColumns = @JoinColumn(
                    name = "account_id",
                    referencedColumnName = "account_id"
            )
            ,inverseJoinColumns = @JoinColumn(
                    name = "authority_name",
                    referencedColumnName = "authority_name"
            )
    )
    private List<AuthorityEntity> authorities;

    @OneToOne(mappedBy = "account")
    private ProfileEntity profile;

    @OneToMany(mappedBy = "owner")
    private List<VoucherEntity> vouchers;

    @ManyToOne
    @JoinColumn(name = "working_at", referencedColumnName = "store_id")
    private StoreEntity workingAt;

    @OneToMany(mappedBy = "createdBy")
    private List<ProductEntity> createdProducts;

    @OneToMany(mappedBy = "account")
    private List<CartDetailsEntity> carts;


    @OneToMany(mappedBy = "account")
    private List<StarRateEntity> starRates;

    @OneToMany(mappedBy = "createdBy")
    private List<FeedbackEntity> createdFeedbacks;

    @OneToMany(mappedBy = "owner")
    private List<OrderEntity> createdOrders;

    @OneToMany(mappedBy = "processBy")
    private List<OrderEntity> processedOrders;

    @OneToMany(mappedBy = "createdBy")
    private List<StoryEntity> createdStories;

    @OneToMany(mappedBy = "createdBy")
    private List<StoreEntity> createdStores;

    @OneToMany(mappedBy = "createdBy")
    private List<BrandEntity> brands;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }
}
