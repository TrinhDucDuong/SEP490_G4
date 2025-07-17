package com.fourfingers.quangvinhstore.infrastructure.schema;

import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ShippingAddressType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "shipping_addresses")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShippingAddressEntity {
    @Id
    @Column(name = "address_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shippingAddressId;

    @Column(name = "address")
    private String address;

    @Column(name = "exact_address")
    private String exactAddress;

    @Column(name = "name")
    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "is_main_address", columnDefinition = "BIT DEFAULT 0")
    private Boolean isMain;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1")
    private Boolean isActive;

    @Column(name = "address_type")
    @Enumerated(EnumType.STRING)
    private ShippingAddressType type;

    @ManyToOne
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "account_id"
    )
    private AccountEntity account;

    @OneToMany(mappedBy = "shippingAddress")
    private List<OrderEntity> orders;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
