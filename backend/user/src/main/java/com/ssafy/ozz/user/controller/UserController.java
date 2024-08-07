package com.ssafy.ozz.user.controller;

import com.ssafy.ozz.user.domain.User;
import com.ssafy.ozz.user.dto.UserUpdateRequest;
import com.ssafy.ozz.user.dto.UserUpdateResponse;
import com.ssafy.ozz.user.global.auth.AuthClient;
import com.ssafy.ozz.user.global.file.FileClient;
import com.ssafy.ozz.user.global.file.dto.FeignFileInfo;
import com.ssafy.ozz.user.global.file.exception.FileUploadException;
import com.ssafy.ozz.user.service.UserService;
import com.ssafy.ozz.user.util.JWTUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.Optional;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final FileClient fileClient;
    private final AuthClient authClient;
    private final UserService userService;
    private final JWTUtil jwtUtil;

    @GetMapping("/")
    @Operation(summary = "토큰으로 유저정보를 조회")
    public ResponseEntity<?> getUserInfo(@Parameter(hidden = true) @RequestHeader("X_User_Id") Long userId) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PutMapping("/")
    @Operation(summary = "토큰으로 유저정보 수정")
    public ResponseEntity<?> updateUser(@Parameter(hidden = true) @RequestHeader("X_User_Id") Long userId, @RequestBody UserUpdateRequest updates) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            User.UserBuilder userBuilder = user.toBuilder();

            String nickname = updates.nickname();
            if (nickname != null) {
                userBuilder.nickname(nickname);
            }
            Date birth = updates.birth();
            if (birth != null) {
                userBuilder.birth(birth);
            }

            User updatedUser = userService.updateUser(userId, userBuilder.build());
            UserUpdateResponse responseDto = new UserUpdateResponse(
                    updatedUser.getId(),
                    updatedUser.getNickname(),
                    updatedUser.getBirth()
            );
            return ResponseEntity.ok(responseDto);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PatchMapping("/profile")
    @Operation(summary = "유저 프로필 변경")
    public ResponseEntity<?> uploadProfileImage(@Parameter(hidden = true) @RequestHeader("X_User_Id") Long userId, @RequestParam("file") MultipartFile file) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            try {
                FeignFileInfo fileInfo = fileClient.uploadFile(file).orElseThrow(FileUploadException::new);
                User user = userOptional.get();
                User updatedUser = user.toBuilder()
                        .profileFileId(fileInfo.fileId())
                        .build();
                userService.updateUser(userId, updatedUser);
                return ResponseEntity.ok(fileInfo);
            } catch (FileUploadException e) {
                return ResponseEntity.status(500).body("파일 업로드 실패");
            }
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @DeleteMapping("/")
    @Operation(summary = "회원 탈퇴")
    public ResponseEntity<?> deleteUser(@Parameter(hidden = true) @RequestHeader("X_User_Id") Long userId) {

        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            userService.deleteUser(userId);
            // 토큰도 삭제
            authClient.deleteRefreshTokenOfUser(userId);
            return ResponseEntity.status(204).body("no content");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @GetMapping("/check")
    @Operation(summary = "닉네임 중복 조회")
    public ResponseEntity<?> checkNickname(@RequestParam(value = "nickname") String nickname) {
        if (userService.existsByNickname(nickname)) {
            throw new ResponseStatusException(BAD_REQUEST, "이미 사용중인 닉네임입니다.");
        }
        return ResponseEntity.ok("사용 가능한 닉네임입니다.");
    }

}
