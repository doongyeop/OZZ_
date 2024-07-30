package com.ssafy.ozz.auth.global.service.impl;

import com.ssafy.ozz.auth.global.domain.Refresh;
import com.ssafy.ozz.auth.global.service.RefreshService;
import com.ssafy.ozz.auth.global.util.JWTUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class RefreshServiceImpl implements RefreshService {

    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    public RefreshServiceImpl(JWTUtil jwtUtil, RedisTemplate<String, Object> redisTemplate) {
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public String createAndSaveRefreshToken(Long userId) {
        String refreshToken = jwtUtil.createJwt("refresh", userId, 86400000L); // 1일
        saveRefreshToken(refreshToken);
        return refreshToken;
    }

    @Override
    public void saveRefreshToken(String refreshToken) {
        // 사용자 ID를 추출
        String userId = jwtUtil.getUserId(refreshToken);

        // 기존 리프레시 토큰이 있으면 삭제
        String existingTokenKey = findExistingRefreshTokenKey(userId);
        if (existingTokenKey != null) {
            redisTemplate.delete(existingTokenKey);
        }

        // 새로운 리프레시 토큰 저장
        String tokenId = UUID.randomUUID().toString();
        Refresh refresh = Refresh.builder()
                .id(tokenId)
                .refreshToken(refreshToken)
                .expiration(new Date(System.currentTimeMillis() + 86400000L))
                .build();

        // RedisTemplate을 사용하여 해시 타입으로 저장
        Map<String, Object> hash = new HashMap<>();
        hash.put("id", refresh.getId());
        hash.put("refreshToken", refresh.getRefreshToken());
        hash.put("expiration", refresh.getExpiration().getTime());
        redisTemplate.opsForHash().putAll("RefreshToken:" + tokenId, hash);
    }

    @Override
    public void deleteRefreshToken(String refreshToken) {
        String existingTokenKey = findExistingRefreshTokenKeyByToken(refreshToken);
        if (existingTokenKey != null) {
            redisTemplate.delete(existingTokenKey);
        }
    }

    @Override
    public Refresh findByRefreshToken(String refreshToken) {
        String existingTokenKey = findExistingRefreshTokenKeyByToken(refreshToken);
        if (existingTokenKey != null) {
            Map<Object, Object> hash = redisTemplate.opsForHash().entries(existingTokenKey);
            if (!hash.isEmpty()) {
                return Refresh.builder()
                        .id((String) hash.get("id"))
                        .refreshToken((String) hash.get("refreshToken"))
                        .expiration(new Date((Long) hash.get("expiration")))
                        .build();
            }
        }
        return null;
    }
    // key로 리프레쉬 토큰 조회
    private String findExistingRefreshTokenKey(String userId) {
        for (String key : redisTemplate.keys("RefreshToken:*")) {
            Map<Object, Object> hash = redisTemplate.opsForHash().entries(key);
            String tokenUserId = jwtUtil.getUserId((String) hash.get("refreshToken"));
            if (userId.equals(tokenUserId)) {
                return key;
            }
        }
        return null;
    }
    // 토큰으로 리프레쉬 토큰 조회
    private String findExistingRefreshTokenKeyByToken(String refreshToken) {
        for (String key : redisTemplate.keys("RefreshToken:*")) {
            Map<Object, Object> hash = redisTemplate.opsForHash().entries(key);
            if (refreshToken.equals(hash.get("refreshToken"))) {
                return key;
            }
        }
        return null;
    }
}
