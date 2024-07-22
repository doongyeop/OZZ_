package com.ssafy.ozz.clothes.clothes.exception;

import com.ssafy.ozz.clothes.global.error.ErrorCode;
import com.ssafy.ozz.clothes.global.error.ServiceException;

public class ClothesNotFoundException extends ServiceException {
    public ClothesNotFoundException() {
        super(ErrorCode.CLOTHES_NOT_FOUND);
    }
}
