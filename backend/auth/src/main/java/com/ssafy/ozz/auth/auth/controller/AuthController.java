package com.ssafy.ozz.auth.auth.controller;

import com.ssafy.ozz.auth.global.domain.Refresh;
import com.ssafy.ozz.auth.global.repository.RefreshRepository;
import com.ssafy.ozz.auth.auth.service.CustomOAuth2UserService;
import com.ssafy.ozz.auth.global.util.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public AuthController(CustomOAuth2UserService customOAuth2UserService, JWTUtil jwtUtil, RefreshRepository refreshRepository) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    @PostMapping("/reissue")
    @Operation(summary = "access토큰 재발급, rotate 적용")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        String refresh = request.getHeader("Refresh");

        if (refresh == null) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // 시간 체크
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String userId = jwtUtil.getUserId(refresh);

        // 리프레시 토큰 검증
        Refresh storedRefreshToken = refreshRepository.findByRefreshToken(refresh);
        if (storedRefreshToken == null || !storedRefreshToken.getRefreshToken().equals(refresh)) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        // 새로운 access + refresh 토큰 발급
        String newAccess = jwtUtil.createJwt("access", Long.parseLong(userId), 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", Long.parseLong(userId), 86400000L); // 1일

        refreshRepository.deleteByRefreshToken(refresh); // rotate 적용
        saveRefreshToken(userId, newRefresh);

        //response
        response.setHeader("access", newAccess);
        response.setHeader("Refresh", newRefresh);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void saveRefreshToken(String userId, String refreshToken) {
        Refresh refresh = Refresh.builder()
                .id(userId)
                .refreshToken(refreshToken)
                .expiration(new Date(System.currentTimeMillis() + 86400000L))
                .build();

        refreshRepository.save(refresh);
    }
}
