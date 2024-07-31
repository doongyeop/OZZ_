package com.ssafy.ozz.user.controller;

import com.ssafy.ozz.user.domain.User;
import com.ssafy.ozz.user.global.file.FileClient;
import com.ssafy.ozz.user.global.file.dto.FeignFileInfo;
import com.ssafy.ozz.user.global.file.exception.FileUploadException;
import com.ssafy.ozz.user.service.UserService;
import com.ssafy.ozz.user.util.JWTUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    private final FileClient fileClient;

    @Autowired
    private JWTUtil jwtUtil;

    @GetMapping("/")
    @Operation(summary = "토큰으로 유저정보를 조회")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {
        String userIdStr = jwtUtil.getUserId(token.replace("Bearer ", ""));
        Long userId = Long.parseLong(userIdStr);

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
    public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> updates) {
        String userIdStr = jwtUtil.getUserId(token.replace("Bearer ", ""));
        Long userId = Long.parseLong(userIdStr);

        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            User.UserBuilder userBuilder = user.toBuilder();

            String nickname = updates.get("nickname");
            if (nickname != null) {
                userBuilder.nickname(nickname);
            }
            String birthstr = updates.get("birth");
            if (birthstr != null) {
                try {
                    Date birth = new SimpleDateFormat("yyyy-MM-dd").parse(birthstr);
                    userBuilder.birth(birth);
                } catch (ParseException e) {
                    return ResponseEntity.badRequest().body("yyyy-MM-dd로 입력해주세요.");
                }
            }
            userService.updateUser(userId, userBuilder.build());
            return ResponseEntity.ok("성공적으로 수정되었습니다.");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PatchMapping("/profile")
    @Operation(summary = "유저 프로필 변경")
    public ResponseEntity<?> uploadProfileImage(@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile file) {
        String userIdStr = jwtUtil.getUserId(token.replace("Bearer ", ""));
        Long userId = Long.parseLong(userIdStr);

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
    public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String token) {
        String userIdStr = jwtUtil.getUserId(token.replace("Bearer ", ""));
        Long userId = Long.parseLong(userIdStr);

        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            userService.deleteUser(userId);
            return ResponseEntity.status(204).body("no content");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}


