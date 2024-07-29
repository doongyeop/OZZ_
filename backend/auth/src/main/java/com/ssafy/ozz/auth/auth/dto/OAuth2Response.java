package com.ssafy.ozz.user.auth.dto;

public interface OAuth2Response {

    String getProvider();
    String getProviderId();
    String getEmail();
    String getName();
    String getBirthYear();
    String getBirthDay();
    String getProfileImageUrl();
}
