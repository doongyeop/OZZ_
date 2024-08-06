package com.ssafy.ozz.board.dto.request;

import com.ssafy.ozz.board.domain.Board;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;
import java.util.List;

@Schema(description = "게시글 생성 요청 DTO")
public record BoardCreateRequest(
        String content,
        List<Tag> tagList,
        Long imgFileId,
        Long userId,
        int age,
        List<Style> styleList
) {
    @Schema(description = "태그 정보")
    public static record Tag(
            Long clothesId,
            double xPosition,
            double yPosition
    ) {
    }

    public Board toEntity(User user) {
        return Board.builder()
                .content(content)
                .imgId(imgFileId)
                .user(user)
                .age(age)
                .style(style)
                .likes(0)
                .createdDate(new Date())
                .build();
    }
}
