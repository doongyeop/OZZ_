package com.ssafy.ozz.clothes.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    INTERNAL_SERVER_ERROR(500, "INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다."),
    CLOTHES_NOT_FOUND(400, "INVALID_HOSPITAL_ID", "옷을 찾을 수 없습니다.");

    private final int httpStatus;
    private final String code;
    private final String message;
}
