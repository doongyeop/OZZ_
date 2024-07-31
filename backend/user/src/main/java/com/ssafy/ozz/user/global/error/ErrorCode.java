package com.ssafy.ozz.user.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    INTERNAL_SERVER_ERROR(500, "서버 오류가 발생했습니다."),
    CLOTHES_NOT_FOUND(400, "옷을 찾을 수 없습니다."),
    CATEGORY_NOT_FOUND(400, "카테고리를 찾을 수 없습니다."),
    COORDINATE_NOT_FOUND(400, "코디를 찾을 수 없습니다."),
    FILE_NOT_FOUND(400, "파일을 찾을 수 없습니다.");

    private final int httpStatus;
    private final String message;
}
