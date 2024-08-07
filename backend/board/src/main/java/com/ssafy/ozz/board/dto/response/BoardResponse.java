package com.ssafy.ozz.board.dto.response;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.library.clothes.properties.Style;
import com.ssafy.ozz.board.domain.Tag;
import com.ssafy.ozz.library.clothes.properties.Style;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;
import java.util.List;

import static com.ssafy.ozz.library.util.EnumBitwiseConverter.toEnums;

@Schema(description = "게시글 상세 정보 DTO")
public record BoardResponse(
        Long id,
        String content,
        Long userId,
        int age,
        int likes,
        List<Style> styleList,
        List<Tag> tagList,
        Date createdDate
) {
    public BoardResponse(Board board) {
        this(
                board.getId(),
                board.getContent(),
                board.getUserId(),
                board.getAge(),
                board.getLikes(),
                toEnums(Style.class, board.getStyle()),
                board.getTags(),
                board.getCreatedDate()
        );
    }
}
