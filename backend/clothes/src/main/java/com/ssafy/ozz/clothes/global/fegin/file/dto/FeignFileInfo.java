package com.ssafy.ozz.clothes.global.fegin.file.dto;

public record FeignFileInfo(
        Long fileId,
        String fileDir,
        String fileName,
        String fileType
){
}
