package com.ssafy.ozz.auth.global.domain;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "refresh", timeToLive = 604800)
public class Refresh {

    @Id // Redis는 Key-Value 저장소라서 Key가 String이 효율적
    private String id;

    @Indexed // 빠른 검색을 위한 인덱스
    private String refreshToken;

    private Date expiration;

}
