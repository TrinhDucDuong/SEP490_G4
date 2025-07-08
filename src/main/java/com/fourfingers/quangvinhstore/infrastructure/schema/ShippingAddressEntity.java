package com.fourfingers.quangvinhstore.infrastructure.schema;

import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ShippingAddressType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    String address;

    @Column(name = "exact_address")
    String exactAddress;

    @Column(name = "name")
    String name;

    @Column(name = "phone_number")
    String phoneNumber;

    @Column(name = "is_main_address")
    boolean isMain;

    @Column(name = "address_type")
    @Enumerated(EnumType.STRING)
    private ShippingAddressType type;

    @ManyToOne
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "account_id"
    )
    private AccountEntity account;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
