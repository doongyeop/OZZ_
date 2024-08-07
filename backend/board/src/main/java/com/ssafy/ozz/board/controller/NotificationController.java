package com.ssafy.ozz.board.controller;

import com.ssafy.ozz.board.domain.Notification;
import com.ssafy.ozz.board.dto.response.NotificationResponse;
import com.ssafy.ozz.board.service.BoardLikesService;
import com.ssafy.ozz.board.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "NotificationController", description = "알림 컨트롤러")
public class NotificationController {

    private final NotificationService notificationService;
    private final BoardLikesService boardLikesService;

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "알림 삭제", description = "알림을 삭제합니다.")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotificationById(notificationId);
        return ResponseEntity.noContent().build();
    }
    //TODO response가 이상함
    @GetMapping("/")
    @Operation(summary = "모든 알림 조회", description = "특정 사용자의 모든 알림을 조회합니다.")
    public ResponseEntity<List<Notification>> getAllNotificationsByUserId(@RequestParam("userId") Long userId) {
        List<Notification> notifications = notificationService.getAllNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{notificationId}")
    @Operation(summary = "알림 읽음 처리", description = "알림을 읽음처리 합니다.")
    public ResponseEntity<Void> readNotification(@PathVariable Long notificationId) {
        notificationService.readNotification(notificationId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}")
    @Operation(summary = "모든 알림 삭제", description = "사용자에게 온 모든 알림을 삭제합니다.")
    public ResponseEntity<Void> deleteAllNotifications(@PathVariable Long userId) {
        notificationService.deleteAllNotifications(userId);
        return ResponseEntity.noContent().build();
    }
    // TODO 500에러
    @GetMapping("/{boardId}")
    @Operation(summary = "좋아요 알림 조회", description = "특정 게시글의 좋아요 알림 내용을 조회합니다.")
    public ResponseEntity<NotificationResponse> getLikeNotifications(@PathVariable("boardId") Long boardId) {
        NotificationResponse notification = boardLikesService.getLikeNotifications(boardId);
        return new ResponseEntity<>(notification, HttpStatus.OK);
    }

}
