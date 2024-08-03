package com.ssafy.ozz.board.dto.request;

import com.ssafy.ozz.board.domain.Board;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;
import java.util.List;

@Schema(description = "게시글 생성 요청 DTO")
public record BoardCreateRequest(
        String content,
        List<Tag> tagList,
        Long imgId,
        Long userId,
        int age,
        List<Style> styleList
) {
    @Schema(description = "태그 정보")
    public static record Tag(
            int clothesId,
            int xPosition,
            int yPosition
    ) {
    }

    public Board toEntity(User user) {
        return Board.builder()
                .content(content)
                .imgId(imgId)
                .user(user)
                .age(age)
                .style(style)
                .likes(0)
                .createdDate(new Date())
                .build();
    }
}
