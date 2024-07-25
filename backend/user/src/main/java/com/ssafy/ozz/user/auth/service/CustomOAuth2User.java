package com.ssafy.ozz.user.auth.service;

import com.ssafy.ozz.user.auth.dto.UserDTO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private final UserDTO userDTO;

    public CustomOAuth2User(UserDTO userDTO) {
        this.userDTO = userDTO;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of(
                "email", userDTO.getEmail(),
                "birth", userDTO.getBirth()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(); // 적절한 권한을 반환
    }

    @Override
    public String getName() {
        return userDTO.getEmail();
    }

    public Long getId() {
        return userDTO.getId();
    }
}
