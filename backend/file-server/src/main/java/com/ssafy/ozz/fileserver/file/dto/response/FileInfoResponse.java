package com.ssafy.ozz.fileserver.file.dto.response;

import com.ssafy.ozz.fileserver.file.domain.File;

public record FileInfoResponse(
        String fileId,
        String fileUrl,
        String fileName,
        String fileType
){
//    FileInfoResponse(File file){
//        this(file.getFileId(), file.get, null, null);
//    }
}
