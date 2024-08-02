package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.BoardLikes;
import com.ssafy.ozz.board.domain.Notification;
import com.ssafy.ozz.board.repository.BoardLikesRepository;
import com.ssafy.ozz.board.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardLikesServiceImpl implements BoardLikesService {

    private final BoardLikesRepository boardLikesRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public boolean toggleLike(BoardLikes boardLikes) {
        Optional<BoardLikes> existingLike = boardLikesRepository.findById(
                new BoardLikes.BoardLikesId(boardLikes.getBoardId(), boardLikes.getUserId())
        );

        if (existingLike.isPresent()) {
            boardLikesRepository.delete(existingLike.get());
            // 읽지 않았다면 알림 삭제
            List<Notification> notifications = notificationRepository.findByBoardId(boardLikes.getBoardId(), boardLikes.getUserId());
            for (Notification noti : notifications) {
                if (!noti.isRead()) {
                    notificationService.deleteNotificationById(noti.getId());
                }
            }
            return false;
        } else {
            BoardLikes newBoardLike = BoardLikes.builder()
                    .boardId(boardLikes.getBoardId())
                    .userId(boardLikes.getUserId())
                    .build();
            boardLikesRepository.save(newBoardLike);

            Notification notification = Notification.builder()
                    .boardId(boardLikes.getBoardId())
                    .user(boardLikes.getUser())
                    .read(false)
                    .build();
            notificationRepository.save(notification);

            return true;
        }
    }

    @Override
    public List<Map<String, Object>> getLikesCountByBoardId(Long boardId) {
        return boardLikesRepository.getLikesCountByBoardId(boardId);
    }
}
