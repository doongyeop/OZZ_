package com.ssafy.ozz.auth.global.domain;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;

import java.util.Date;

@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "RefreshToken", timeToLive = 172800) // 2일
public class Refresh {

    @Id
    private String id;

    private String refreshToken;

    private Date expiration;
}
