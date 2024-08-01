package com.ssafy.ozz.board.controller;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.dto.request.BoardCreateRequest;
import com.ssafy.ozz.board.dto.request.BoardUpdateRequest;
import com.ssafy.ozz.board.dto.response.BoardWithFileResponse;
import com.ssafy.ozz.board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("/")
    @Operation(summary = "게시글 작성")
    public ResponseEntity<Board> createBoard(
            @RequestParam("userId") Long userId,
            @RequestParam("imgFile") MultipartFile imgFile,
            @RequestBody BoardCreateRequest request) {
        Board createdBoard = boardService.createBoard(userId, imgFile, request);
        return ResponseEntity.ok(createdBoard);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "특정 사용자가 작성한 글 조회")
    public ResponseEntity<Board> getBoardsByUserId(@PathVariable Long userId) {
        return boardService.getBoardsByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/")
    @Operation(summary = "모든 게시글 조회")
    public ResponseEntity<Page<Board>> getBoards(Pageable pageable) {
        Page<Board> boards = boardService.getBoards(pageable);
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/{boardId}")
    @Operation(summary = "게시글 상세 조회")
    public ResponseEntity<Board> getBoard(@PathVariable Long boardId) {
        Board board = boardService.getBoard(boardId);
        return ResponseEntity.ok(board);
    }

    @PutMapping("/{boardId}")
    @Operation(summary = "게시글 수정(이미지X)")
    public ResponseEntity<Board> updateBoard(
            @PathVariable Long boardId,
            @RequestBody BoardUpdateRequest request) {
        Board updatedBoard = boardService.updateBoard(boardId, request);
        return ResponseEntity.ok(updatedBoard);
    }

    @PutMapping("/{boardId}/image")
    @Operation(summary = "게시글 수정 + 이미지")
    public ResponseEntity<BoardWithFileResponse> updateBoardWithImage(
            @PathVariable Long boardId,
            @RequestParam("imgFile") MultipartFile imgFile,
            @RequestBody BoardUpdateRequest request) {
        BoardWithFileResponse response = boardService.updateBoard(boardId, request, imgFile);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{boardId}")
    @Operation(summary = "게시글 삭제")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long boardId) {
        boardService.deleteBoard(boardId);
        return ResponseEntity.noContent().build();
    }
}
