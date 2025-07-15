package com.fourfingers.quangvinhstore.infrastructure.schema.enums;

public enum OrderStatus {
    DELIVERED_AND_PAID, // add paid to delivered for COD
    PAID_AND_SHIPPING,
    DELIVERED, // TODO: bỏ
    SHIPPING,
    PAID, // TODO: bỏ
    PROCESSING, // TODO: bỏ
    PREPARING,
    CANCELED
}
