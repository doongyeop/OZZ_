package com.ssafy.ozz.board.dto.response;

import com.ssafy.ozz.board.domain.Board;
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
        FeignFileInfo imgFIle
) {
    public BoardWithFileResponse(Board board, FeignFileInfo imgFile) {
        this(
                board.getId(),
                board.getContent(),
                board.getImgId(),
                board.getUser().getId(),
                board.getAge(),
                board., // 비트연산
                board.getLikes(),
                board.getCreatedDate(),
                imgFile
        );
    }
}
