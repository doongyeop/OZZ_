package com.ssafy.ozz.board.dto.request;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.library.clothes.properties.Style;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;
import java.util.List;

import static com.ssafy.ozz.library.util.EnumBitwiseConverter.toBits;

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
                .style(toBits(styleList))
                .likes(0)
                .createdDate(new Date())
                .build();
    }
}
