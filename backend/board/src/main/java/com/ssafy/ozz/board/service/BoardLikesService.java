package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.BoardLikes;
import com.ssafy.ozz.board.dto.response.NotificationResponse;


public interface BoardLikesService {
    boolean toggleLike(BoardLikes boardLikes);

    NotificationResponse getLikeNotifications(Long boardId);

    int getLikesCountByBoardId(Long boardId);

}
