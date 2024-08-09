package com.ssafy.ozz.board.dto.response;

import com.ssafy.ozz.library.file.FileInfo;

import java.util.Date;

public record UserResponse(
        Long userId,
        String nickname,
        Date birth,
        Long profileFileId,
        FileInfo profileImg
) {
}
