package com.ssafy.ozz.board.global.feign.user;

import com.ssafy.ozz.board.global.config.FeignSupportConfig;
import com.ssafy.ozz.library.user.UserInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;


@FeignClient(name = "ozz-user", path = "/api/users", configuration = FeignSupportConfig.class)
public interface UserClient {
    @GetMapping("/")
    Optional<UserInfo> getUserInfo(@RequestParam("userId") Long userId);
}

