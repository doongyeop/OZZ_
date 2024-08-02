package com.ssafy.ozz.board.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "게시글 수정 요청 DTO")
public record BoardUpdateRequest(
        String content,
        Long imgId,
        int age,
        List<Integer> styleList,
        List<Tag> tagList
) {
    @Schema(description = "태그 정보")
    public static record Tag(
            int clothesId,
            int xPosition,
            int yPosition
    ) {
    }
}
