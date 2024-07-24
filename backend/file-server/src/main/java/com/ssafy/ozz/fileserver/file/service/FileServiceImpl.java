package com.ssafy.ozz.fileserver.file.service;

import com.ssafy.ozz.fileserver.file.domain.Files;
import com.ssafy.ozz.fileserver.file.dto.response.FileInfoResponse;
import com.ssafy.ozz.fileserver.file.repository.FileRepository;
import com.ssafy.ozz.fileserver.global.util.FileUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    private final FileRepository fileRepository;

    @Transactional()
    public FileInfoResponse saveFile(MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String storedFileName = UUID.randomUUID().toString() + "." + originalFileName;
        String mimeType = file.getContentType();

        //MIMETYPE 체크
        if (!FileUtil.isImageFile(mimeType)) {
            throw new FileUploadException("이미지 파일만 업로드할 수 있습니다.");
        }
        Files fileEntity = Files.builder()
                .type(mimeType)
                .name(originalFileName)
                .path("/"+storedFileName).build();
        fileRepository.save(fileEntity);
        File saveFile = new File(uploadDir, storedFileName);
        file.transferTo(saveFile.toPath());

        return new FileInfoResponse(fileEntity);
    }
//
//
//    /**
//     * [중복방지를 위한 파일 고유명 생성]
//     * @param fileExtension 확장자
//     * @return String 파일 고유이름
//     */
//    private String generateUniqueFileName(String originalFileName) {
//        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
//        // Random 객체 생성
//        Random random = new Random();
//        // 0 이상 100 미만의 랜덤한 정수 반환
//        String randomNumber = Integer.toString(random.nextInt(Integer.MAX_VALUE));
//        String timeStamp = dateFormat.format(new Date());
//        return timeStamp + randomNumber + originalFileName;
}
