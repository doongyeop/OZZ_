package com.ssafy.ozz.board.dto.response;

import com.ssafy.ozz.library.file.FileInfo;

public record UserResponse(
        Long userId,
        String nickname,
        Long profileFileId,
        FileInfo profileImg
) {
}
