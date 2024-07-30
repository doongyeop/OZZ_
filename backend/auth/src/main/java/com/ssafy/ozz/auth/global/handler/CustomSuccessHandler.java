package com.ssafy.ozz.auth.global.handler;

import com.ssafy.ozz.auth.global.domain.Refresh;
import com.ssafy.ozz.auth.global.repository.RefreshRepository;
import com.ssafy.ozz.auth.auth.service.CustomOAuth2User;
import com.ssafy.ozz.auth.global.service.RefreshService;
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
    private final RefreshService refreshService;

    public CustomSuccessHandler(JWTUtil jwtUtil, RefreshService refreshService) {
        this.jwtUtil = jwtUtil;
        this.refreshService = refreshService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
        Long userId = customUserDetails.getId();

        // 유저 ID로 토큰 생성
        String access = jwtUtil.createJwt("access", userId, 600000L); // User ID로 JWT 생성
        String refresh = refreshService.createAndSaveRefreshToken(userId);

        response.setHeader("access", access);
        response.setHeader("refresh", refresh);

        response.sendRedirect("http://localhost:3000/");
    }
}
