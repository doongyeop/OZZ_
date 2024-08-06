package com.ssafy.ozz.board.controller;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.dto.request.BoardCreateRequest;
import com.ssafy.ozz.board.dto.request.BoardUpdateRequest;
import com.ssafy.ozz.board.dto.response.BoardResponse;
import com.ssafy.ozz.board.dto.response.BoardWithFileResponse;
import com.ssafy.ozz.board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@Tag(name = "BoardController", description = "게시글 API")
public class BoardController {

    private final BoardService boardService;

    @PostMapping("/")
    @Operation(summary = "게시글 등록")
    public ResponseEntity<Board> createBoard(
            @RequestParam("userId") Long userId,
            @RequestParam("imgFileId") Long imgFileId,
            @RequestBody BoardCreateRequest request) {
        Board createdBoard = boardService.createBoard(userId, imgFileId, request);
        return ResponseEntity.ok(createdBoard);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "작성 글 조회", description = "특정 사용자가 작성한 글을 조회합니다.")
    public ResponseEntity<Board> getBoardsByUserId(@PathVariable Long userId) {
        return boardService.getBoardsByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/")
    @Operation(summary = "모든 게시글 조회", description = "모든 게시글을 조회합니다.")
    public ResponseEntity<Page<Board>> getBoards(Pageable pageable) {
        Page<Board> boards = boardService.getBoards(pageable);
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/{boardId}")
    @Operation(summary = "게시글 상세 조회", description = "게시글을 상세 조회합니다.")
    public ResponseEntity<Board> getBoard(@PathVariable Long boardId) {
        Board board = boardService.getBoard(boardId);
        return ResponseEntity.ok(board);
    }

    @PutMapping("/{boardId}")
    @Operation(summary = "게시글 수정(이미지X)", description = "게시글의 이미지를 제외한 항목을 수정합니다.")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable Long boardId,
            @RequestBody BoardUpdateRequest request) {
        BoardResponse response = boardService.updateBoard(boardId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{boardId}/img")
    @Operation(summary = "게시글 수정 + 이미지", description = "게시글을 수정합니다.")
    public ResponseEntity<BoardWithFileResponse> updateBoardWithImage(
            @PathVariable Long boardId,
            @RequestParam("imgFileId") Long imgFileId,
            @RequestBody BoardUpdateRequest request) {
        BoardWithFileResponse response = boardService.updateBoardFile(boardId, request, imgFileId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{boardId}")
    @Operation(summary = "게시글 삭제", description = "게시글을 삭제합니다.")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long boardId) {
        boardService.deleteBoard(boardId);
        return ResponseEntity.noContent().build();
    }


    ////// 조건별 보회//////
    @GetMapping("/sort/age")
    @Operation(summary = "나이별 게시글 조회", description = "특정 나이대의 게시글을 필터링하여 조회합니다.")
    public ResponseEntity<Page<Board>> getBoardsByAgeRange(
            @RequestParam("age") String age, Pageable pageable) {
        int startAge = 0;
        if (age.length() != 1) {
            startAge = Integer.parseInt(age.substring(0, 1)) * 10;
        }
        int endAge = startAge + 9;
        Page<Board> boards = boardService.getBoardsByAgeRange(pageable, startAge, endAge);
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/sort/style")
    @Operation(summary = "스타일별 게시글 조회", description = "특정 스타일의 게시글을 필터링하여 조회합니다.")
    public ResponseEntity<Page<Board>> getBoardsByStyle(
            @RequestParam("style") String style, Pageable pageable) {
        Page<Board> boards = boardService.getBoardsByStyle(pageable, style);
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/sort/likes")
    @Operation(summary = "좋아요 순으로 게시글 조회", description = "최근 하루 동안의 좋아요 순으로 게시글을 조회합니다.")
    public ResponseEntity<Page<Board>> getBoardsSortedByLikesInLastDay(Pageable pageable) {
        Page<Board> boards = boardService.getBoardsSortedByLikesInOneDay(pageable);
        return ResponseEntity.ok(boards);
    }
}
