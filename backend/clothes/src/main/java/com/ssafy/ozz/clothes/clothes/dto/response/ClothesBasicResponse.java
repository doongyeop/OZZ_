package com.ssafy.ozz.clothes.clothes.dto.response;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.properties.*;
import com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

public record ClothesBasicResponse(
        Long clothesId,
        String name,
        LocalDateTime createdDate,
        Long imageFileId,
        CategoryLow categoryLow
) {
    public ClothesBasicResponse(Clothes clothes) {
        this(
                clothes.getClothesId(),
                clothes.getName(),
                clothes.getCreatedDate(),
                clothes.getImageFileId(),
                clothes.getCategoryLow()
        );
    }
}