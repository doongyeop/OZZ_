package com.ssafy.ozz.board.dto.response;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.domain.Tag;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;
import java.util.List;

@Schema(description = "게시글 상세 정보 DTO with 파일 DTO")
public record BoardWithFileResponse(
        Long id,
        String content,
        Long imgId,
        Long userId,
        int age,
        List<Style> styleList,
        int likes,
        Date createdDate,
        List<Tag> tagList,
        Long imgFIleId
) {
    public BoardWithFileResponse(Board board, Long imgFIleId) {
        this(
                board.getId(),
                board.getContent(),
                board.getImgId(),
                board.getUser().getId(),
                board.getAge(),
                board., // 비트연산
                board.getTags(),
                board.getLikes(),
                board.getCreatedDate(),
                imgFIleId
        );
    }
}
