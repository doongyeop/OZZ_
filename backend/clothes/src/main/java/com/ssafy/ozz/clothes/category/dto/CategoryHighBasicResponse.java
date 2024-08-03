package com.ssafy.ozz.clothes.category.dto;

import com.ssafy.ozz.clothes.category.domain.CategoryHigh;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "상위 카테고리 기본 정보 DTO")
public record CategoryHighBasicResponse(
    Byte categoryHighId,
    String name
){
    public CategoryHighBasicResponse(CategoryHigh categoryHigh){
        this(
            categoryHigh.getCategoryHighId(),
            categoryHigh.getName()
        );
    }
}