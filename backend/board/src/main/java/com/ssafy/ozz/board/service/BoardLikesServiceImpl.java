package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.domain.BoardLikes;
import com.ssafy.ozz.board.domain.Notification;
import com.ssafy.ozz.board.repository.BoardLikesRepository;
import com.ssafy.ozz.board.repository.BoardRepository;
import com.ssafy.ozz.board.repository.NotificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardLikesServiceImpl implements BoardLikesService {

    private final BoardRepository boardRepository;
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

            // 좋아요 취소 시 해당 알림을 찾아 삭제
            Optional<Notification> existringNotification = notificationRepository.findByBoardIdAndUserId(boardLikes.getBoardId(), boardLikes.getUserId());
            existringNotification.ifPresent(notification -> { // 삭제 안했고
                if (!notification.isRead()) { // 읽지 않았으면
                    notificationService.deleteNotificationById(notification.getId());
                }
            });

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
    public int getLikesCountByBoardId(Long boardId) {
        int cnt = boardLikesRepository.countByBoardId(boardId);
        Optional<Board> boardOptional = boardRepository.findById(boardId);

        if (boardOptional.isPresent()) {
            Board existingBoard = boardOptional.get();
            Board updatedBoard = existingBoard.toBuilder()
                    .likes(cnt)
                    .build();
            boardRepository.save(updatedBoard);
        }
        return cnt;
    }
}
