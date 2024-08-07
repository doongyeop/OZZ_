package com.ssafy.ozz.library.user;

import lombok.Getter;

import java.util.Date;

public record UserInfo(
        Long userId,
        String nickname,
        Long profileFileId,
        Date Birth
) {
}
