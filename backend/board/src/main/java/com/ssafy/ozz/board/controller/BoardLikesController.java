package com.ssafy.ozz.board.controller;


import com.ssafy.ozz.board.domain.BoardLikes;
import com.ssafy.ozz.board.dto.response.NotificationResponse;
import com.ssafy.ozz.board.service.BoardLikesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/boardlikes")
@RequiredArgsConstructor
@Tag(name = "boardLikesRestController", description = "게시글 좋아요/취소 컨트롤러")
public class BoardLikesController {

    private final BoardLikesService boardLikesService;

    @PostMapping("/")
    @Operation(summary = "게시글 좋아요/취소", description = "게시글을 좋아요합니다. 이미 좋아요 했다면 취소합니다.")
    public ResponseEntity<Boolean> toggleLike(@RequestBody BoardLikes boardLikes) {
        boolean isLiked = boardLikesService.toggleLike(boardLikes);
        return new ResponseEntity<>(isLiked, HttpStatus.OK);
    }

    @GetMapping("/{boardId}")
    @Operation(summary = "좋아요 수 조회", description = "특정 게시글의 좋아요 수를 조회합니다.")
    public ResponseEntity<Integer> getLikesCountByBoardId(@PathVariable("boardId") Long boardId) {
        int likesCount = boardLikesService.getLikesCountByBoardId(boardId);
        return new ResponseEntity<>(likesCount, HttpStatus.OK);
    }


}
