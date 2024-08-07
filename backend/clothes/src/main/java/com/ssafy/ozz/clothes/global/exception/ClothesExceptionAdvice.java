package com.ssafy.ozz.clothes.global.exception;

import com.ssafy.ozz.library.error.ErrorCode;
import com.ssafy.ozz.library.error.ServiceException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ClothesExceptionAdvice {
    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<String> handleSerialException(final ServiceException e) {
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(errorCode.getMessage());
    }
}
