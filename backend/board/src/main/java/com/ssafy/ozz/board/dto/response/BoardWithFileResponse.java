package com.ssafy.ozz.board.dto.response;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.library.file.FileInfo;
import com.ssafy.ozz.library.user.UserInfo;
import com.ssafy.ozz.library.clothes.properties.Style;
import com.ssafy.ozz.board.domain.Tag;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;
import java.util.List;

import static com.ssafy.ozz.library.util.EnumBitwiseConverter.toEnums;

@Schema(description = "게시글 상세 정보 DTO with 파일 및 사용자 정보")
public record BoardWithFileResponse(
        Long id,
        String content,
        Long userId,
        int age,
        List<Style> styleList,
        int likes,
        Date createdDate,
        List<Tag> tagList,
        FileInfo fileInfo,
        UserResponse userInfo
) {
    public BoardWithFileResponse(Board board, FileInfo fileInfo, UserResponse userInfo) {
        this(
                board.getId(),
                board.getContent(),
                board.getUserId(),
                board.getAge(),
                toEnums(Style.class, board.getStyle()),
                board.getLikes(),
                board.getCreatedDate(),
                board.getTags(),
                fileInfo,
                userInfo
        );
    }
}
