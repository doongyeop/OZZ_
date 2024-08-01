package com.ssafy.ozz.board.controller;

import com.ssafy.ozz.board.domain.Notification;
import com.ssafy.ozz.board.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotificationById(notificationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotificationsByUserId(@RequestParam("userId") Long userId) {
        List<Notification> notifications = notificationService.getAllNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{notificationId}")
    public ResponseEntity<Void> readNotification(@PathVariable Long notificationId) {
        notificationService.readNotification(notificationId);
        return ResponseEntity.noContent().build();
    }
}
