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

    public CustomSuccessHandler(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
        Long userId = customUserDetails.getId(); // User ID를 가져옵니다.
        String access = jwtUtil.createJwt("access", userId, 6000000L); // User ID로 JWT 생성
        String refresh = jwtUtil.createJwt("refresh", userId, 86400000L);

        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh));
        response.sendRedirect("http://localhost:3000/");
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setHttpOnly(true); // 클라이언트에서 쿠키 접근 못하게
        return cookie;
    }

}
