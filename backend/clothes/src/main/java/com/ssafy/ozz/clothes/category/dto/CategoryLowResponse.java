package com.ssafy.ozz.clothes.category.dto;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;

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

