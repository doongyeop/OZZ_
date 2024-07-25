package com.ssafy.ozz.user.auth.service;

import com.ssafy.ozz.user.auth.dto.KakaoResponse;
import com.ssafy.ozz.user.auth.dto.NaverResponse;
import com.ssafy.ozz.user.auth.dto.OAuth2Response;
import com.ssafy.ozz.user.auth.dto.UserDTO;
import com.ssafy.ozz.user.user.domain.User;
import com.ssafy.ozz.user.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("kakao")) {
            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
        } else {
            return null;
        }

        String username = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            String birthYear = oAuth2Response.getBirthYear();
            String birthDay = oAuth2Response.getBirthDay();
            Date birth = convertToBirthTimestamp(birthYear, birthDay);
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(oAuth2Response.getEmail());
            newUser.setBirth(birth);
            newUser.setProvider(oAuth2Response.getProvider());
            newUser.setOauthToken(oAuth2Response.getOauthToken());
            userRepository.save(newUser);

            UserDTO userDTO = new UserDTO();
            userDTO.setEmail(oAuth2Response.getEmail());
            userDTO.setBirth(birth);
            userDTO.setUsername(username);
            userDTO.setProvider(oAuth2Response.getProvider());
            userDTO.setOauthToken(oAuth2Response.getOauthToken());
            return new CustomOAuth2User(userDTO);
        } else {
            String birthYear = oAuth2Response.getBirthYear();
            String birthDay = oAuth2Response.getBirthDay();
            Date birth = convertToBirthTimestamp(birthYear, birthDay);
            user.setEmail(oAuth2Response.getEmail());
            user.setBirth(birth);
            user.setProvider(oAuth2Response.getProvider()); // provider 설정
            user.setOauthToken(oAuth2Response.getOauthToken());

            userRepository.save(user);

            UserDTO userDTO = new UserDTO();
            userDTO.setEmail(oAuth2Response.getEmail());
            userDTO.setBirth(birth);
            userDTO.setUsername(username);
            userDTO.setProvider(oAuth2Response.getProvider()); // provider 설정
            userDTO.setOauthToken(oAuth2Response.getOauthToken());
            return new CustomOAuth2User(userDTO);
        }
    }

    private Timestamp convertToBirthTimestamp(String birthyear, String birthday) {
        // 카카오에서 날짜정보 형식이 다름
        if (birthday.length() == 4) {
            birthday = birthday.substring(0, 2) + "-" + birthday.substring(2, 4);
        }
        String birthDate = birthyear + "-" + birthday;
        LocalDate date = LocalDate.parse(birthDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        return Timestamp.valueOf(date.atStartOfDay());
    }
}
