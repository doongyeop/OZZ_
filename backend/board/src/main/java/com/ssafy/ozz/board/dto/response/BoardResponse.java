package com.ssafy.ozz.board.dto.response;

import com.ssafy.ozz.board.domain.Board;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;

@Schema(description = "게시글 상세 정보 DTO")
public record BoardResponse(
        Long id,
        String content,
        Long imgId,
        Long userId,
        int age,
        List<Style> styleList,
        int likes,
        Date createdDate
) {
    public BoardResponse(Board board) {
        this(
                board.getId(),
                board.getContent(),
                board.getImgId(),
                board.getUser().getId(),
                board.getAge(),
                board., // 비트연산 넣기
                board.getLikes(),
                board.getCreatedDate()
        );
    }
}
