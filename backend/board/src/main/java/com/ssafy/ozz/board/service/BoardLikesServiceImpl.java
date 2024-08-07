package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.domain.BoardLikes;
import com.ssafy.ozz.board.domain.Notification;
import com.ssafy.ozz.board.dto.response.NotificationResponse;
import com.ssafy.ozz.board.dto.response.UserResponse;
import com.ssafy.ozz.board.global.feign.file.FileClient;
import com.ssafy.ozz.board.global.feign.user.UserClient;
import com.ssafy.ozz.board.repository.BoardLikesRepository;
import com.ssafy.ozz.board.repository.BoardRepository;
import com.ssafy.ozz.board.repository.NotificationRepository;
import com.ssafy.ozz.library.global.error.exception.FileNotFoundException;
import com.ssafy.ozz.library.global.error.exception.UserNotFoundException;
import com.ssafy.ozz.library.file.FileInfo;
import com.ssafy.ozz.library.user.UserInfo;
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
    private final FileClient fileClient;
    private final UserClient userClient;

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
            existingNotification.ifPresent(notification -> {
                if (!notification.isRead()) {
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

            // 알림 생성
            UserInfo userInfo = userClient.getUserInfo(boardLikes.getUserId()).orElseThrow(UserNotFoundException::new);
            Notification notification = Notification.builder()
                    .boardId(boardLikes.getBoardId())
                    .userId(boardLikes.getUserId())
                    .read(false)
                    .content(userInfo.nickname() + "(이)가 내 코디를 마음에 들어합니다.")
                    .build();
            notificationRepository.save(notification);

            return true;
        }
    }

    @Override
    public NotificationResponse getLikeNotifications(Long boardId) {
        List<Notification> notifications = notificationRepository.findByBoardId(boardId);
        List<UserResponse> users = notifications.stream()
                .map(notification -> {
                    UserInfo userInfo = userClient.getUserInfo(notification.getUserId()).orElseThrow(UserNotFoundException::new);
                    FileInfo profileImage = fileClient.getFile(userInfo.profileFileId()).orElseThrow(FileNotFoundException::new);
                    return new UserResponse(
                            userInfo.userId(),
                            userInfo.nickname(),
                            userInfo.Birth(),
                            userInfo.profileFileId(),
                            profileImage
                    );
                })
                .collect(Collectors.toList());

        int size = users.size();
        String message;
        if (size == 1) {
            message = users.get(size - 1).nickname() + "님이 내 코디를 마음에 들어합니다.";
        } else if (size == 2) {
            message = users.get(size - 1).nickname() + "님과 " + users.get(size - 2).nickname() + "님이 내 코디를 마음에 들어합니다.";
        } else if (size == 3) {
            message = users.get(size - 1).nickname() + "님, " + users.get(size - 2).nickname() + "님, " + users.get(size - 3).nickname() + "님이 내 코디를 마음에 들어합니다.";
        } else {
            message = users.get(size - 1).nickname() + "님 외 " + (size - 1) + "명이 내 코디를 마음에 들어합니다.";
        }

        Board board = boardRepository.findById(boardId).orElseThrow(EntityNotFoundException::new);
        FileInfo boardImageFile = fileClient.getFile(board.getImgFileId()).orElseThrow(FileNotFoundException::new);

        return new NotificationResponse(
                boardId,
                message,
                users,
                boardImageFile
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
