package com.ssafy.ozz.clothes.category.dto;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "하위 카테고리 정보 DTO")
public record CategoryLowResponse (
    Byte categoryLowId,
    String name
){
    public CategoryLowResponse(CategoryLow categoryLow) {
        this(
            categoryLow.getCategoryLowId(),
            categoryLow.getName()
        );
    }
}

