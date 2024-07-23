package com.ssafy.ozz.fileserver.file.controller;

import com.ssafy.ozz.fileserver.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.aspectj.weaver.tools.cache.SimpleCacheFactory.path;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/file")
public class FileController {
    private final FileService fileService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) throws Exception {
        //TODO : 사진 업로드
        System.out.println(file.getOriginalFilename());
        System.out.println(file.getContentType());
        System.out.println(file.getName());
        fileService.saveFile(file);
        return ResponseEntity.ok(1);
    }

//    @GetMapping("{fileId}")
//    public ResponseEntity<byte[]> download(@PathVariable(required = true, name = "fileId") String fileId) {
//        return ResponseEntity.ok(new ByteArrayResource(fileId.getBytes()));
//    }
//
//    @GetMapping("/info/{fileId}")
//    public ResponseEntity<String> info(@PathVariable(required = true, name = "fileId") String fileId) {
//        return ResponseEntity.ok(fileId.toString());
//    }
}
