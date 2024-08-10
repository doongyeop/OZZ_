package com.ssafy.ozz.board.controller;


import com.ssafy.ozz.board.service.BoardLikesService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import static com.ssafy.ozz.library.config.HeaderConfig.X_USER_ID;

@RestController
@RequestMapping("/api/boardlikes")
@RequiredArgsConstructor
@Tag(name = "boardLikesRestController", description = "게시글 좋아요/취소 컨트롤러")
public class BoardLikesController {

    private final BoardLikesService boardLikesService;

    // TODO 500 취소만됨
    @PostMapping("/{boardId}")
    @Operation(summary = "게시글 좋아요/취소", description = "게시글을 좋아요합니다. 이미 좋아요 했다면 취소합니다.")
    public ResponseEntity<Boolean> toggleLike(@PathVariable("boardId") Long boardId, @Parameter(hidden = true) @RequestHeader(X_USER_ID) Long userId) {
        boolean isLiked = boardLikesService.toggleLike(boardId, userId);
        return new ResponseEntity<>(isLiked, HttpStatus.OK);
    }

}
