package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Account {
    private Long accountId;
    private String username;
    private String email;
    private Boolean isActive;
//    private List<Authority> authorities;
    private List<CartDetails> carts;
}
