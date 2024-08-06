package com.ssafy.ozz.clothes.global.fegin.file.exception;

import com.ssafy.ozz.library.global.error.ErrorCode;
import com.ssafy.ozz.library.global.error.ServiceException;

public class FileNotFoundException extends ServiceException {
    public FileNotFoundException() {
        super(ErrorCode.FILE_NOT_FOUND);
    }
}
