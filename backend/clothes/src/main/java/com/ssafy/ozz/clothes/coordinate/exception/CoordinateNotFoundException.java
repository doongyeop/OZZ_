package com.ssafy.ozz.clothes.coordinate.exception;

import com.ssafy.ozz.library.global.error.ErrorCode;
import com.ssafy.ozz.library.global.error.ServiceException;

public class CoordinateNotFoundException extends ServiceException {
    public CoordinateNotFoundException() {
        super(ErrorCode.COORDINATE_NOT_FOUND);
    }
}
