package com.ssafy.ozz.clothes.global.fegin.file.dto;

public record FeignFileInfo(
        Long fileId,
        String filePath,
        String fileName,
        String fileType
){
}
