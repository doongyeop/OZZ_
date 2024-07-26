package com.ssafy.ozz.clothes.global.fegin.file;

import com.ssafy.ozz.clothes.global.config.FeignSupportConfig;
import com.ssafy.ozz.clothes.global.fegin.file.dto.FeignFileInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@FeignClient(name = "ozz-file", path = "/api/file", configuration = FeignSupportConfig.class)
public interface FileClient {

    @PostMapping(consumes = "multipart/form-data")
    Optional<FeignFileInfo> uploadFile(@RequestPart("file") MultipartFile file);
}
