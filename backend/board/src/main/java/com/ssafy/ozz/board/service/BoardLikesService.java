package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.BoardLikes;

public interface BoardLikesService {
    boolean toggleLike(BoardLikes boardLikes);
    int getLikesCountByBoardId(Long boardId);
}
