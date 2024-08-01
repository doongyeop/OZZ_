package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.BoardLikes;

import java.util.List;
import java.util.Map;

public interface BoardLikesService {
    boolean toggleLike(BoardLikes boardLikes);
    List<Map<String, Object>> getLikesCountByBoardId(Long boardId);
}
