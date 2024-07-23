package com.ssafy.ozz.clothes.category.service;

import com.ssafy.ozz.clothes.category.domain.CategoryHigh;
import com.ssafy.ozz.clothes.category.domain.CategoryLow;

import java.util.List;

public interface CategoryService {
    CategoryHigh getCategoryHigh(Long categoryHighId);
    List<CategoryHigh> getAllCategoryHigh();
    CategoryLow getCategoryLow(Long categoryLowId);
}
