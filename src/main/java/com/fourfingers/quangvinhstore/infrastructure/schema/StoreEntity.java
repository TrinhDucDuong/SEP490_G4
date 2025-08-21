package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "stores")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StoreEntity {
    @Id
    @Column(name = "store_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storeId;

    @Column(name = "store_name", columnDefinition = "NVARCHAR(255)", nullable = false)
    @NotBlank(message = "Name cannot be blank")
    private String storeName;

    @Column(name = "store_address", nullable = false, columnDefinition = "NVARCHAR(255)")
    @NotBlank(message = "Address cannot be blank")
    private String storeAddress;

    @Column(name = "store_phone", nullable = false, columnDefinition = "VARCHAR(20)")
    @NotBlank(message = "Phone cannot be blank")
    @Size(min = 10, max = 15, message = "Phone number must have between 10 and 15 digits")
    @Pattern(regexp = "^[0-9]+$", message = "Phone number must contain only digits")
    private String storePhone;

    @Column(name = "city", nullable = false, columnDefinition = "NVARCHAR(255)")
    @NotBlank(message = "City cannot be blank")
    private String city;

    @Column(name = "district", nullable = false, columnDefinition = "NVARCHAR(255)")
    @NotBlank(message = "District cannot be blank")
    private String district;

    @Column(name = "start_working_at", nullable = false)
    @NotNull(message = "Start working time cannot be null")
    private LocalTime startWorkingAt;

    @Column(name = "end_working_at", nullable = false)
    @NotNull(message = "End working time cannot be null")
    private LocalTime endWorkingAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "updated_by", referencedColumnName = "account_id")
    private AccountEntity updatedBy;

    @Column(name = "is_active", nullable = false, columnDefinition = "BIT DEFAULT 1")
    private Boolean isActive;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workingAt")
    private List<AccountEntity> staffs;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "stores")
    private List<ProductVariantEntity> productVariants;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "account_id")
    private AccountEntity createdBy;

    @Column(name = "location_lat", nullable = false, columnDefinition = "VARCHAR(20)")
    @NotBlank(message = "Latitude location cannot be blank")
    private String locationLat;

    @Column(name = "location_lng", nullable = false, columnDefinition = "VARCHAR(20)")
    @NotBlank(message = "Longitude location cannot be blank")
    private String locationLng;

    public void setEndWorkingAt(LocalTime endWorkingAt) {
        if(endWorkingAt.isAfter(startWorkingAt)) {
            this.endWorkingAt = endWorkingAt;
        } else {
            throw new IllegalArgumentException("End working time must be after start working time");
        }
    }
}
