package com.ssafy.ozz.auth.global.handler;

import com.ssafy.ozz.auth.global.domain.Refresh;
import com.ssafy.ozz.auth.global.repository.RefreshRepository;
import com.ssafy.ozz.auth.auth.service.CustomOAuth2User;
import com.ssafy.ozz.auth.global.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Date;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public CustomSuccessHandler(JWTUtil jwtUtil, RefreshRepository refreshRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
        Long userId = customUserDetails.getId();
        
        // 유저 ID로 토큰 생성
        String access = jwtUtil.createJwt("access", userId, 600000L); // User ID로 JWT 생성
        String refresh = jwtUtil.createJwt("refresh", userId, 86400000L);

        response.setHeader("access", access);
        saveRefreshToken(userId.toString(), refresh);

        response.sendRedirect("http://localhost:3000/");
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
