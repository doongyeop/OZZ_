package com.ssafy.ozz.auth.provider.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "providers")
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder(toBuilder = true)
@Getter
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "providers_id")
    private Long id;

    @Column(nullable = false, name = "users_id")
    private Long userId;

    // provider가 제공하는 유저id
    @Column(nullable = false, name = "pu_id")
    private String idFromProvider;

    private String name; // provider 이름

}
