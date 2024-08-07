package com.ssafy.ozz.board.dto.response;

import java.util.List;

public record NotificationResponse(
        Long boardId,
        String message,
        Long boardImgId,
        List<UserResponse> users
) {
}
