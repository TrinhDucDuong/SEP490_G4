package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carts")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CartEntity {
    @Id
    @Column(name = "cart_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    @ManyToOne
    @JoinColumn(name = "account_id" , nullable = false)
    private AccountEntity owner;

    @ManyToOne
    @JoinColumn(name = "product_variant_id" , nullable = false)
    private ProductVariantEntity productVariant;

    @Column(name = "quantity" , nullable = false)
    private Long quantity;
}
