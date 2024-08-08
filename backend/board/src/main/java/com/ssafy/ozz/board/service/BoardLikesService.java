package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.dto.response.NotificationResponse;

public interface BoardLikesService {
    boolean toggleLike(Long boardId, Long userId);

    void updateLikesCount(Long boardId);

    NotificationResponse getLikeNotifications(Long boardId);

}
