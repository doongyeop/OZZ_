package com.ssafy.ozz.user.global.handler;

import com.ssafy.ozz.user.auth.domain.Refresh;
import com.ssafy.ozz.user.auth.repository.RefreshRepository;
import com.ssafy.ozz.user.auth.service.CustomOAuth2User;
import com.ssafy.ozz.user.global.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
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
        Long userId = customUserDetails.getId(); // User ID

        String access = jwtUtil.createJwt("access", userId, 6000000L); // User ID로 JWT 생성
        String refresh = jwtUtil.createJwt("refresh", userId, 86400000L);

        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh));

        // Refresh 토큰을 데이터베이스에 저장
        Refresh refreshToken = new Refresh();
        refreshToken.setUserId(userId);
        refreshToken.setRefresh(refresh);
        refreshToken.setExpiration(new Date(System.currentTimeMillis() + 86400000L)); // 24시간 후 만료

        refreshRepository.save(refreshToken);

        response.sendRedirect("http://localhost:3000/");
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setHttpOnly(true); // 클라이언트에서 쿠키 접근 못하게
        return cookie;
    }
}
