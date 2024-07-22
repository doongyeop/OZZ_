package com.ssafy.ozz.clothes.category.service;

import com.ssafy.ozz.clothes.category.domain.CategoryHigh;
import com.ssafy.ozz.clothes.category.domain.CategoryLow;

public interface CategoryService {
    CategoryHigh getCategoryHigh(Long categoryHighId);
    CategoryLow getCategoryLow(Long categoryLowId);
}
