package com.ssafy.ozz.board.controller;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.dto.request.BoardCreateRequest;
import com.ssafy.ozz.board.dto.request.BoardUpdateRequest;
import com.ssafy.ozz.board.dto.response.BoardResponse;
import com.ssafy.ozz.board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.ssafy.ozz.library.config.HeaderConfig.X_USER_ID;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@Tag(name = "BoardController", description = "게시글 API")
public class BoardController {

    private final BoardService boardService;

    @PostMapping("/")
    @Operation(summary = "게시글 등록")
    public ResponseEntity<Long> createBoard(
            @RequestBody BoardCreateRequest request) {
        Long userId = request.userId();
        Long imgFileId = request.imgFileId();
        Board board = boardService.createBoard(userId, imgFileId, request);

        return ResponseEntity.status(201).body(board.getId());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "유저ID로 작성 글 조회", description = "특정 사용자가 작성한 글을 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoardsByUserId(
            @Parameter(hidden = true) @RequestHeader(X_USER_ID) Long userId, Pageable pageable) {
        Page<Board> boards = boardService.getBoardsByUserId(userId, pageable);
        Page<BoardResponse> boardResponses = boards.map(boardService::mapToBoardResponse);

        return ResponseEntity.ok(boardResponses);
    }

    @GetMapping("/")
    @Operation(summary = "모든 게시글 조회", description = "모든 게시글을 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoards(Pageable pageable) {
        Page<Board> boards = boardService.getBoards(pageable);
        Page<BoardResponse> boardResponses = boards.map(boardService::mapToBoardResponse);

        return ResponseEntity.ok(boardResponses);
    }

    @GetMapping("/{boardId}")
    @Operation(summary = "게시글 상세 조회", description = "게시글을 상세 조회합니다.")
    public ResponseEntity<?> getBoard(@PathVariable Long boardId) {
        Board board = boardService.getBoard(boardId);
        BoardResponse boardResponse = boardService.mapToBoardResponse(board);

        return ResponseEntity.ok(boardResponse);
    }

    @GetMapping("/sort/age")
    @Operation(summary = "나이별 게시글 조회", description = "특정 나이대의 게시글을 필터링하여 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoardsByAgeRange(
            @RequestParam("age") String age, Pageable pageable) {
        int startAge = age.length() != 1 ? Integer.parseInt(age.substring(0, 1)) * 10 : 0;
        int endAge = startAge + 9;

        Page<Board> boards = boardService.getBoardsByAgeRange(pageable, startAge, endAge);
        Page<BoardResponse> boardResponses = boards.map(boardService::mapToBoardResponse);

        return ResponseEntity.ok(boardResponses);
    }

    @GetMapping("/sort/style")
    @Operation(summary = "스타일별 게시글 조회", description = "특정 스타일의 게시글을 필터링하여 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoardsByStyle(
            @RequestParam("style") Integer style, Pageable pageable) {
        Page<Board> boards = boardService.getBoardsByStyle(pageable, style);
        Page<BoardResponse> boardResponses = boards.map(boardService::mapToBoardResponse);

        return ResponseEntity.ok(boardResponses);
    }

    @GetMapping("/sort/likes")
    @Operation(summary = "좋아요 순으로 게시글 조회", description = "최근 하루 동안의 좋아요 순으로 게시글을 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoardsSortedByLikesInLastDay(Pageable pageable) {
        Page<Board> boards = boardService.getBoardsSortedByLikesInOneDay(pageable);
        Page<BoardResponse> boardResponses = boards.map(boardService::mapToBoardResponse);

        return ResponseEntity.ok(boardResponses);
    }

    @PutMapping("/{boardId}")
    @Operation(summary = "게시글 수정", description = "게시글을 수정합니다.")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable Long boardId,
            @RequestBody BoardUpdateRequest request) {
        Long imgFileId = request.imgFileId();
        BoardResponse response = boardService.updateBoard(boardId, request, imgFileId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{boardId}")
    @Operation(summary = "게시글 삭제", description = "게시글을 삭제합니다.")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long boardId) {
        boardService.deleteBoard(boardId);
        return ResponseEntity.noContent().build();
    }

//    @PostMapping("/get/{coordinateId}")
//    @Operation(summary = "게시글에서 코디가져오기", description = "게시글의 코디를 내 코디북으로 가져옵니다.")
//    public ResponseEntity<Boolean> getCoordinate(@PathVariable Long coordinateId) {
//        if (existing) {
//            delete
//            return ResponseEntity.ok(false);
//        }
//        save
//        return ResponseEntity.ok(true);
//    }

}
