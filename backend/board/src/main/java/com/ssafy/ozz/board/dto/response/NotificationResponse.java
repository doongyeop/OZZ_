package com.ssafy.ozz.board.dto.response;

import com.ssafy.ozz.library.file.FileInfo;

import java.util.List;

public record NotificationResponse(
        Long boardId,
        String message,
        List<UserResponse> users,
        FileInfo boardImg
) {
}
