package com.ssafy.ozz.clothes.clothes.dto.response;

import com.ssafy.ozz.clothes.category.dto.CategoryLowResponse;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.global.fegin.file.dto.FeignFileInfo;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "옷 기본 정보 DTO")
public record ClothesBasicWithFileResponse(
        Long clothesId,
        String name,
        LocalDateTime createdDate,
        CategoryLowResponse categoryLow,
        FeignFileInfo imageFile
        ) {
    public ClothesBasicWithFileResponse(Clothes clothes, FeignFileInfo fileInfo) {
        this(
                clothes.getClothesId(),
                clothes.getName(),
                clothes.getCreatedDate(),
                new CategoryLowResponse(clothes.getCategoryLow()),
                fileInfo
        );
    }
}