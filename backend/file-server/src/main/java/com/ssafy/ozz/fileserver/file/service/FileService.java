package com.ssafy.ozz.fileserver.file.service;

import com.ssafy.ozz.fileserver.file.dto.response.FileInfoResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    FileInfoResponse saveFile(MultipartFile file) throws Exception;
}