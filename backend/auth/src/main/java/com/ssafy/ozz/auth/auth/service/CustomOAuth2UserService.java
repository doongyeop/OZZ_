package com.ssafy.ozz.auth.auth.service;

import com.ssafy.ozz.auth.auth.dto.KakaoResponse;
import com.ssafy.ozz.auth.auth.dto.NaverResponse;
import com.ssafy.ozz.auth.auth.dto.OAuth2Response;
import com.ssafy.ozz.auth.auth.dto.UserDTO;
import com.ssafy.ozz.auth.provider.domain.Provider;
import com.ssafy.ozz.auth.provider.repository.ProviderRepository;
import com.ssafy.ozz.auth.user.domain.User;
import com.ssafy.ozz.auth.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;

    public CustomOAuth2UserService(UserRepository userRepository, ProviderRepository providerRepository) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
    }

    @Override
    @Transactional
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

        String email = oAuth2Response.getEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Provider> existingProvider = providerRepository.findByIdFromProviderAndName(oAuth2Response.getProviderId(), oAuth2Response.getProvider());

            if (!existingProvider.isPresent()) {
                throw new OAuth2AuthenticationException("다른 소셜로그인으로 이미 가입되어있어요! 로그인 후 마이페이지에서 연동해주세요.");
            }

            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .birth(user.getBirth())
                    .username(user.getUsername())
                    .provider(user.getProvider())
                    .build();

            return new CustomOAuth2User(userDTO);

        } else {
            // new user
            String birthYear = oAuth2Response.getBirthYear();
            String birthDay = oAuth2Response.getBirthDay();
            Date birth = convertToBirthTimestamp(birthYear, birthDay);

            User user = User.builder()
                    .email(email)
                    .birth(birth)
                    .provider(oAuth2Response.getProvider())
                    .username(oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId())
                    .build();

            userRepository.save(user);

            Provider provider = Provider.builder()
                    .userId(user.getId())
                    .idFromProvider(oAuth2Response.getProviderId())
                    .name(oAuth2Response.getProvider())
                    .build();
            providerRepository.save(provider);

            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .birth(user.getBirth())
                    .username(user.getUsername())
                    .provider(user.getProvider())
                    .build();

            return new CustomOAuth2User(userDTO);
        }
    }
    // 계정 연동
    @Transactional
    public void linkAccount(String email, String providerId, String providerName) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (!optionalUser.isPresent()) {
            throw new OAuth2AuthenticationException("연동할 이메일 계정이 존재하지 않습니다.");
        }

        User user = optionalUser.get();
        Optional<Provider> existingProvider = providerRepository.findByIdFromProviderAndName(providerId, providerName);

        if (existingProvider.isPresent()) {
            throw new OAuth2AuthenticationException("이미 연동된 계정입니다.");
        }

        Provider provider = Provider.builder()
                .userId(user.getId())
                .idFromProvider(providerId)
                .name(providerName)
                .build();
        providerRepository.save(provider);
    }
    // yyyy-MM-dd 형식으로 변환
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
