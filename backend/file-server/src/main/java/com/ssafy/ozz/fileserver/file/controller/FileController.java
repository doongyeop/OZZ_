package com.ssafy.ozz.fileserver.file.controller;

import com.ssafy.ozz.fileserver.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/file")
public class FileController {
    private final FileService fileService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) throws Exception {
        //TODO : 사진 업로드
        return ResponseEntity.ok(fileService.saveFile(file));
    }
}
