package com.ssafy.ozz.board.dto.request;

import com.ssafy.ozz.library.clothes.properties.Style;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "게시글 수정 요청 DTO")
public record BoardUpdateRequest(
        String content,
        Long imgFileId,
        int age,
        List<Style> styleList,
        List<Tag> tagList
) {
    @Schema(description = "태그 정보")
    public static record Tag(
            Long clothesId,
            double xPosition,
            double yPosition
    ) {
    }
}
