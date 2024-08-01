package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.Notification;
import com.ssafy.ozz.board.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public void createNotification(Notification notification) {
        notificationRepository.save(notification);
    }

    @Override
    public Notification getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId).orElse(null);
    }

    @Override
    public List<Notification> getAllNotificationsByUserId(Long userId) {
        return notificationRepository.findAllByUserId(userId);
    }

    @Override
    public void readNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        Notification updatedNotification = notification.toBuilder()
                .read(true)
                .build();
        notificationRepository.save(updatedNotification);
    }

    @Override
    public void deleteNotificationById(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
