package com.ssafy.ozz.user.global.auth;

import com.ssafy.ozz.user.global.config.FeignSupportConfig;
import com.ssafy.ozz.user.global.file.dto.FeignFileInfo;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@FeignClient(name = "ozz-auth", path = "/api/auth", configuration = FeignSupportConfig.class)
public interface AuthClient {

    @DeleteMapping("/users/{userId}/refresh")
    ResponseEntity<Void> deleteRefreshTokenOfUser(@PathVariable Long userId);
}
