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

    // OK
    @PostMapping("/")
    @Operation(summary = "게시글 등록")
    public ResponseEntity<Long> createBoard(
            @RequestBody BoardCreateRequest request) {
        Long userId = request.userId();
        Long imgFileId = request.imgFileId();

        Board board = boardService.createBoard(userId, imgFileId, request);

        return ResponseEntity.status(201).body(board.getId());
    }

    // 503 ERROR
    @GetMapping("/user/{userId}")
    @Operation(summary = "유저ID로 작성 글 조회", description = "특정 사용자가 작성한 글을 조회합니다.")
    public ResponseEntity<Page<BoardWithFileResponse>> getBoardsByUserId(@PathVariable Long userId, Pageable pageable) {
        List<Board> boards = boardService.getBoardsByUserId(userId);
        List<BoardWithFileResponse> boardResponses = boards.stream().map(board -> {
            FileInfo fileInfo = fileClient.getFile(board.getImgFileId()).orElse(null);
            UserInfo userInfo = userClient.getUserInfo(board.getUserId()).orElse(null);

            UserResponse userResponse = null;
            if (userInfo != null) {
                userResponse = new UserResponse(
                        userInfo.userId(),
                        userInfo.nickname(),
                        userInfo.Birth(),
                        userInfo.profileFileId(),
                        fileClient.getFile(userInfo.profileFileId()).orElse(null)
                );
            }

            return new BoardWithFileResponse(board, fileInfo, userResponse);
        }).collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), boardResponses.size());
        Page<BoardWithFileResponse> page = new PageImpl<>(boardResponses.subList(start, end), pageable, boardResponses.size());
        return ResponseEntity.ok(page);
    }

    // 500
    @GetMapping("/")
    @Operation(summary = "모든 게시글 조회", description = "모든 게시글을 조회합니다.")
    public ResponseEntity<Page<BoardWithFileResponse>> getBoards(Pageable pageable) {
        List<Board> boards = boardService.getBoards(pageable).getContent();
        List<BoardWithFileResponse> boardResponses = boards.stream()
                .map(board -> {
                    FileInfo fileInfo = fileClient.getFile(board.getImgFileId()).orElseThrow(UserNotFoundException::new);
                    UserInfo userInfo = userClient.getUserInfo(board.getUserId()).orElseThrow(FileNotFoundException::new);

                    UserResponse userResponse = null;
                    if (userInfo != null) {
                        FileInfo profileImg = fileClient.getFile(userInfo.profileFileId()).orElseThrow(FileNotFoundException::new);
                        userResponse = new UserResponse(
                                userInfo.userId(),
                                userInfo.nickname(),
                                userInfo.Birth(),
                                userInfo.profileFileId(),
                                profileImg
                        );
                    }

                    return new BoardWithFileResponse(board, fileInfo, userResponse);
                })
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), boardResponses.size());
        Page<BoardWithFileResponse> page = new PageImpl<>(boardResponses.subList(start, end), pageable, boardResponses.size());

        return ResponseEntity.ok(page);
    }

    //  500에러
    @GetMapping("/{boardId}")
    @Operation(summary = "게시글 상세 조회", description = "게시글을 상세 조회합니다.")
    public ResponseEntity<?> getBoard(@PathVariable Long boardId) {
        Board board = boardService.getBoard(boardId);

        FileInfo fileInfo = fileClient.getFile(board.getImgFileId()).orElseThrow(FileNotFoundException::new);
        UserInfo userInfo = userClient.getUserInfo(board.getUserId()).orElseThrow(UserNotFoundException::new);

        UserResponse userResponse = new UserResponse(
                userInfo.userId(),
                userInfo.nickname(),
                userInfo.Birth(),
                userInfo.profileFileId(),
                fileClient.getFile(userInfo.profileFileId()).orElseThrow(FileNotFoundException::new)
        );
        return ResponseEntity.ok(new BoardWithFileResponse(board, fileInfo, userResponse));
    }

    //    //   RequestBody 수정 // @JsonIgnoreProperties({"boardLikes", "tags"})
//    @PutMapping("/{boardId}")
//    @Operation(summary = "게시글 수정(이미지X)", description = "게시글의 이미지를 제외한 항목을 수정합니다.")
//    public ResponseEntity<BoardResponse> updateBoard(
//            @PathVariable Long boardId,
//            @RequestBody BoardUpdateRequest request) {
//        BoardResponse response = boardService.updateBoard(boardId, request);
//        return ResponseEntity.ok(response);
//    }
    // TODO 500에러
    @PutMapping("/{boardId}")
    @Operation(summary = "게시글 수정", description = "게시글을 수정합니다.")
    public ResponseEntity<BoardWithFileResponse> updateBoardWithImage(
            @PathVariable Long boardId,
            @RequestBody BoardUpdateRequest request) {
        Long imgFileId = request.imgFileId();
        BoardWithFileResponse response = boardService.updateBoardFile(boardId, request, imgFileId);
        return ResponseEntity.ok(response);
    }
    // 왜 너도 안되니.. 500
    @DeleteMapping("/{boardId}")
    @Operation(summary = "게시글 삭제", description = "게시글을 삭제합니다.")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long boardId) {
        boardService.deleteBoard(boardId);
        return ResponseEntity.noContent().build();
    }

    ////// 조건별 조회 //////
    //  Response 무한 -> @JsonIgnoreProperties({"boardLikes", "tags"})
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

    //  500
    @GetMapping("/sort/style")
    @Operation(summary = "스타일별 게시글 조회", description = "특정 스타일의 게시글을 필터링하여 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoardsByStyle(
            @RequestParam("style") String style, Pageable pageable) {
        Page<BoardResponse> boards = boardService.getBoardsByStyle(pageable, style).map(BoardResponse::new);
        return ResponseEntity.ok(boards);
    }

    // RESPONSE 무한 ㅠ
    @GetMapping("/sort/likes")
    @Operation(summary = "좋아요 순으로 게시글 조회", description = "최근 하루 동안의 좋아요 순으로 게시글을 조회합니다.")
    public ResponseEntity<Page<BoardResponse>> getBoardsSortedByLikesInLastDay(Pageable pageable) {
        Page<BoardResponse> boards = boardService.getBoardsSortedByLikesInOneDay(pageable).map(BoardResponse::new);
        return ResponseEntity.ok(boards);
    }
}
