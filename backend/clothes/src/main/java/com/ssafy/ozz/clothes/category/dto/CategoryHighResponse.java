package com.ssafy.ozz.clothes.category.dto;

import com.ssafy.ozz.clothes.category.domain.CategoryHigh;

import java.util.List;

public record CategoryHighResponse(
        Byte categoryHighId,
    String name,
    List<CategoryLowResponse> categoryLowList
){
    public CategoryHighResponse(CategoryHigh categoryHigh){
        this(
            categoryHigh.getCategoryHighId(),
            categoryHigh.getName(),
            categoryHigh.getCategoryLowList().stream().map(CategoryLowResponse::new).toList()
        );
    }
}
