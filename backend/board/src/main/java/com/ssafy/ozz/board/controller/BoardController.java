package com.ssafy.ozz.board.controller;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.dto.request.BoardCreateRequest;
import com.ssafy.ozz.board.dto.request.BoardUpdateRequest;
import com.ssafy.ozz.board.dto.response.BoardResponse;
import com.ssafy.ozz.board.dto.response.BoardWithFileResponse;
import com.ssafy.ozz.board.dto.response.UserResponse;
import com.ssafy.ozz.board.global.feign.file.FileClient;
import com.ssafy.ozz.board.global.feign.user.UserClient;
import com.ssafy.ozz.board.service.BoardService;
import com.ssafy.ozz.library.error.exception.FileNotFoundException;
import com.ssafy.ozz.library.file.FileInfo;
import com.ssafy.ozz.library.global.error.exception.UserNotFoundException;
import com.ssafy.ozz.library.user.UserInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@Tag(name = "BoardController", description = "게시글 API")
public class BoardController {

    private final BoardService boardService;
    private final UserClient userClient;
    private final FileClient fileClient;

    @PostMapping("/")
    @Operation(summary = "게시글 등록")
    public ResponseEntity<BoardWithFileResponse> createBoard(
            @RequestParam("userId") Long userId,
            @RequestParam("imgFileId") Long imgFileId,
            @RequestBody BoardCreateRequest request) {
        Board board = boardService.createBoard(userId, imgFileId, request);
        FileInfo fileInfo = fileClient.getFile(request.imgFileId()).orElseThrow(FileNotFoundException::new);
        UserInfo userInfo = userClient.getUserInfo(userId).orElseThrow(UserNotFoundException::new);
        UserResponse userResponse = new UserResponse(
                userInfo.userId(),
                userInfo.nickname(),
                userInfo.Birth(),
                userInfo.profileFileId(),
                fileClient.getFile(userInfo.profileFileId()).orElseThrow(FileNotFoundException::new)
        );
        BoardWithFileResponse response = new BoardWithFileResponse(board, fileInfo, userResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "작성 글 조회", description = "특정 사용자가 작성한 글을 조회합니다.")
    public ResponseEntity<Page<BoardWithFileResponse>> getBoardsByUserId(@PathVariable Long userId, Pageable pageable) {
        List<BoardWithFileResponse> boards = boardService.getBoardsByUserId(userId)
                .stream()
                .map(board -> {
                    FileInfo fileInfo = fileClient.getFile(board.getImgFileId()).orElseThrow(FileNotFoundException::new);
                    UserInfo userInfo = userClient.getUserInfo(board.getUserId()).orElseThrow(UserNotFoundException::new);

                    UserResponse userResponse = new UserResponse(
                            userInfo.userId(),
                            userInfo.nickname(),
                            userInfo.Birth(),
                            userInfo.profileFileId(),
                            fileClient.getFile(userInfo.profileFileId()).orElseThrow(com.ssafy.ozz.library.global.error.exception.FileNotFoundException::new)
                    );

                    return new BoardWithFileResponse(board, fileInfo, userResponse);
                })
                .collect(Collectors.toList());
        Page<BoardWithFileResponse> page = new PageImpl<>(boards, pageable, boards.size());
        return ResponseEntity.ok(page);
    }

    @GetMapping("/")
    @Operation(summary = "모든 게시글 조회", description = "모든 게시글을 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoards(Pageable pageable) {
        Page<BoardResponse> boards = boardService.getBoards(pageable).map(BoardResponse::new);
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/{boardId}")
    @Operation(summary = "게시글 상세 조회", description = "게시글을 상세 조회합니다.")
    public ResponseEntity<?> getBoard(@PathVariable Long boardId) {
        Board board = boardService.getBoard(boardId);
        if (board.getImgFileId() != null) {
            FileInfo fileInfo = fileClient.getFile(board.getImgFileId()).orElseThrow(FileNotFoundException::new);
            UserInfo userInfo = userClient.getUserInfo(board.getUserId()).orElseThrow(UserNotFoundException::new);

            UserResponse userResponse = new UserResponse(
                    userInfo.userId(),
                    userInfo.nickname(),
                    userInfo.Birth(),
                    userInfo.profileFileId(),
                    fileClient.getFile(userInfo.profileFileId()).orElseThrow(com.ssafy.ozz.library.global.error.exception.FileNotFoundException::new)
            );

            return ResponseEntity.ok(new BoardWithFileResponse(board, fileInfo, userResponse));
        } else {
            return ResponseEntity.ok(new BoardResponse(board));
        }
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

    ////// 조건별 조회 //////
    @GetMapping("/sort/age")
    @Operation(summary = "나이별 게시글 조회", description = "특정 나이대의 게시글을 필터링하여 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoardsByAgeRange(
            @RequestParam("age") String age, Pageable pageable) {
        int startAge = 0;
        if (age.length() != 1) {
            startAge = Integer.parseInt(age.substring(0, 1)) * 10;
        }
        int endAge = startAge + 9;
        Page<BoardResponse> boards = boardService.getBoardsByAgeRange(pageable, startAge, endAge).map(BoardResponse::new);
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/sort/style")
    @Operation(summary = "스타일별 게시글 조회", description = "특정 스타일의 게시글을 필터링하여 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoardsByStyle(
            @RequestParam("style") String style, Pageable pageable) {
        Page<BoardResponse> boards = boardService.getBoardsByStyle(pageable, style).map(BoardResponse::new);
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/sort/likes")
    @Operation(summary = "좋아요 순으로 게시글 조회", description = "최근 하루 동안의 좋아요 순으로 게시글을 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoardsSortedByLikesInLastDay(Pageable pageable) {
        Page<BoardResponse> boards = boardService.getBoardsSortedByLikesInOneDay(pageable).map(BoardResponse::new);
        return ResponseEntity.ok(boards);
    }
}
