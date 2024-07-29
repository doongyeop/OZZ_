package com.ssafy.ozz.clothes.clothes.dto.response;

import com.ssafy.ozz.clothes.category.dto.CategoryLowResponse;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "옷 기본 정보 DTO")
public record ClothesBasicResponse(
        Long clothesId,
        String name,
        LocalDateTime createdDate,
        Long imageFileId,
        CategoryLowResponse categoryLow
) {
    public ClothesBasicResponse(Clothes clothes) {
        this(
                clothes.getClothesId(),
                clothes.getName(),
                clothes.getCreatedDate(),
                clothes.getImageFileId(),
                new CategoryLowResponse(clothes.getCategoryLow())
        );
    }
}