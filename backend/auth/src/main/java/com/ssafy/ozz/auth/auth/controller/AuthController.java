package com.ssafy.ozz.auth.auth.controller;

import com.ssafy.ozz.auth.auth.domain.Refresh;
import com.ssafy.ozz.auth.auth.repository.RefreshRepository;
import com.ssafy.ozz.auth.auth.service.CustomOAuth2UserService;
import com.ssafy.ozz.auth.global.util.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
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

        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                }
            }
        }

        if (refresh == null) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }
        // 시간 체크
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("refresh token 만료", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String userId = jwtUtil.getUserId(refresh);

        // access + refresh 토큰 발급
        String newAccess = jwtUtil.createJwt("access", Long.parseLong(userId), 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", Long.parseLong(userId), 86400000L);

        refreshRepository.deleteByRefresh(refresh);
        addRefreshEntity(Long.parseLong(userId), newRefresh, 86400000L);

        //response
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setHttpOnly(true);

        return cookie;
    }

    private void addRefreshEntity(Long userId, String refresh, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        Refresh refreshEntity = new Refresh();
        refreshEntity.builder()
                .userId(userId)
                .refresh(refresh)
                .expiration(date)
                .build();

        refreshRepository.save(refreshEntity);
    }
}