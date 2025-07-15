package com.fourfingers.quangvinhstore.infrastructure.schema.enums;

public enum OrderStatus {
    DELIVERED_AND_PAID, // add paid to delivered for COD
    PAID_AND_SHIPPING,
    SHIPPING,
//    PAID,
//    PROCESSING,
    PREPARING,
    CANCELED
}