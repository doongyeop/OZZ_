package com.ssafy.ozz.clothes.coordinate.exception;

import com.ssafy.ozz.clothes.global.error.ErrorCode;
import com.ssafy.ozz.clothes.global.error.ServiceException;

public class CoordinateNotFoundException extends ServiceException {
    public CoordinateNotFoundException() {
        super(ErrorCode.CLOTHES_NOT_FOUND);
    }
}
