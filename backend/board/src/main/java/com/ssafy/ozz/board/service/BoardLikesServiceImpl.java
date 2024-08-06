package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.domain.BoardLikes;
import com.ssafy.ozz.board.domain.Notification;
import com.ssafy.ozz.board.dto.response.NotificationResponse;
import com.ssafy.ozz.board.dto.response.UserResponse;
import com.ssafy.ozz.board.repository.BoardLikesRepository;
import com.ssafy.ozz.board.repository.BoardRepository;
import com.ssafy.ozz.board.repository.NotificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
            Optional<Notification> existingNotification = notificationRepository.findByBoardIdAndUserId(boardLikes.getBoardId(), boardLikes.getUserId());
            existingNotification.ifPresent(notification -> { // 삭제 안했고
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
                    .content(boardLikes.getUser().getNickname() + "(이)가 내 코디를 마음에 들어합니다.")
                    .build();
            notificationRepository.save(notification);

            return true;
        }
    }

    @Override
    public NotificationResponse getLikeNotifications(Long boardId) {
        List<Notification> notifications = notificationRepository.findByBoardId(boardId);
        List<UserResponse> users = notifications.stream()
                .map(notification -> new UserResponse(notification.getUser().getNickname(), notification.getUser().getProfileFileId()))
                .collect(Collectors.toList());

        int size = users.size();
        String message;
        if (size == 1) {
            message = users.get(0).nickname() + "님이 내 코디를 마음에 들어합니다.";
        } else if (size == 2) {
            message = users.get(0).nickname() + "님과 " + users.get(1).nickname() + "님이 내 코디를 마음에 들어합니다.";
        } else if (size == 3) {
            message = users.get(0).nickname() + "님, " + users.get(1).nickname() + "님, " + users.get(2).nickname() + "님이 내 코디를 마음에 들어합니다.";
        } else {
            message = users.get(0).nickname() + "님 외 " + (size - 1) + "명이 내 코디를 마음에 들어합니다.";
        }

        Board board = boardRepository.findById(boardId).orElseThrow(EntityNotFoundException::new);

        return new NotificationResponse(
                boardId,
                message,
                board.getImgId(),
                users
        );
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
