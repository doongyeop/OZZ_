package com.ssafy.ozz.board.dto.response;

import com.ssafy.ozz.board.domain.Board;
import io.swagger.v3.oas.annotations.media.Schema;

import javax.swing.text.Style;
import java.util.Date;
import java.util.List;

@Schema(description = "게시글 상세 정보 DTO")
public record BoardResponse(
        Long id,
        String content,
        Long imgId,
        Long userId,
        int age,
        List<Style> style,
        int likes,
        Date createdDate
) {
    public BoardResponse(Board board) {
        this(
                board.getId(),
                board.getContent(),
                board.getImgId(),
                board.getUserId(),
                board.getAge(),
                toEnums(Style.class, clothes.getStyle())
                board.getLikes(),
                board.getCreatedDate()
        );
    }
}
