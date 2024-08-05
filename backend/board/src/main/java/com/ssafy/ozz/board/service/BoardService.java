package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.dto.request.BoardCreateRequest;
import com.ssafy.ozz.board.dto.request.BoardUpdateRequest;
import com.ssafy.ozz.board.dto.response.BoardResponse;
import com.ssafy.ozz.board.dto.response.BoardWithFileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface BoardService {
    Board createBoard(Long userId, MultipartFile imageFile, BoardCreateRequest request);
    Optional<Board> getBoardsByUserId(Long userId);
    Page<Board> getBoards(Pageable pageable);
    Board getBoard(Long boardId);
    BoardResponse updateBoard(Long boardId, BoardUpdateRequest request);
    BoardWithFileResponse updateBoard(Long boardId, BoardUpdateRequest request, MultipartFile imgFile);
    void deleteBoard(Long boardId);
    // 정렬
    Page<Board> getBoardsSortedBy(Pageable pageable, String sortBy);
    Page<Board> getBoardsSortedByLikesInOneDay(Pageable pageable);
}
