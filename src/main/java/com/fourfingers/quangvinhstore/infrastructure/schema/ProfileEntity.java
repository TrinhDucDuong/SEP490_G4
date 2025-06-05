package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class ProfileEntity {
    @Id
    @Column(name = "profile_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "ship_address", nullable = false, length = 255)
    private String shipAddress;

    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "account_id")
    private AccountEntity account;
}
