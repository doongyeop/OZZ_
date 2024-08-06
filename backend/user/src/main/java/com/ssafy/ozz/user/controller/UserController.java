package com.ssafy.ozz.user.controller;

import com.ssafy.ozz.user.domain.User;
import com.ssafy.ozz.user.dto.UserUpdateRequest;
import com.ssafy.ozz.user.dto.UserUpdateResponse;
import com.ssafy.ozz.user.global.file.FileClient;
import com.ssafy.ozz.user.global.file.dto.FeignFileInfo;
import com.ssafy.ozz.user.global.file.exception.FileUploadException;
import com.ssafy.ozz.user.service.UserService;
import com.ssafy.ozz.user.util.JWTUtil;
import io.jsonwebtoken.Jwts;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final FileClient fileClient;
    private final UserService userService;
    private final JWTUtil jwtUtil;

    @GetMapping("/")
    @Operation(summary = "토큰으로 유저정보를 조회")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);

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
    public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String token, @RequestBody UserUpdateRequest updates) {
        Long userId = getUserIdFromToken(token);

        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            User.UserBuilder userBuilder = user.toBuilder();

            String nickname = updates.nickname();
            if (nickname != null) {
                userBuilder.nickname(nickname);
            }
            String birthstr = String.valueOf(updates.birth());
            if (birthstr != null) {
                try {
                    Date birth = new SimpleDateFormat("yyyy-MM-dd").parse(birthstr);
                    userBuilder.birth(birth);
                } catch (ParseException e) {
                    return ResponseEntity.badRequest().body("yyyy-MM-dd로 입력해주세요.");
                }
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

    private Long getUserIdFromToken(String token) {
        // 토큰에서 userId를 추출하는 로직
        // 예시: JWT 토큰에서 클레임으로 userId 추출
        return Long.parseLong(Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject());
    }
}

    @PatchMapping("/profile")
    @Operation(summary = "유저 프로필 변경")
    public ResponseEntity<?> uploadProfileImage(@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile file) {
        Long userId = getUserIdFromToken(token);

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
        Long userId = getUserIdFromToken(token);

        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            userService.deleteUser(userId);
            // 토큰도 삭제
            String existingTokenKey = findExistingRefreshTokenKey(userId);
            if (existingTokenKey != null) {
                redisTemplate.delete(existingTokenKey);
            }
            return ResponseEntity.status(204).body("no content");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
    
//    // 걍 updateUser(45줄) 이거쓰면 될 듯
//    @PutMapping("/nickname")
//    @Operation(summary = "최초 로그인 시 닉네임 입력")
//    public ResponseEntity<?> registNickName(@RequestHeader("Authorization") String token, @RequestParam(value = "nickname") String nickname) {
//        Long userId = getUserIdFromToken(token);
//
//        Optional<User> userOptional = userService.getUserById(userId);
//        if (userOptional.isPresent()) {
//            User user = userOptional.get();
//            User updatedUser = user.toBuilder()
//                    .nickname(nickname)
//                    .build();
//            userService.updateUser(userId, updatedUser);
//            return ResponseEntity.ok("닉네임이 등록되었습니다.");
//        } else {
//            return ResponseEntity.status(404).body("User not found");
//        }
//    }

    @GetMapping("/check")
    @Operation(summary = "닉네임 중복 조회")
    public ResponseEntity<?> checkNickname(@RequestParam(value = "nickname") String nickname) {
        if (userService.existsByNickname(nickname)) {
            throw new ResponseStatusException(BAD_REQUEST, "이미 사용중인 닉네임입니다.");
        }
        return ResponseEntity.ok("사용 가능한 닉네임입니다.");
    }

    // 토큰에서 userId 추출해서 Long 타입으로 반환
    private Long getUserIdFromToken(String token) {
        String userIdStr = jwtUtil.getUserId(token.replace("Bearer ", ""));
        return Long.parseLong(userIdStr);
    }

}
