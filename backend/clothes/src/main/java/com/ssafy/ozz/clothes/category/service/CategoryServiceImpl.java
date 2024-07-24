package com.ssafy.ozz.clothes.category.service;

import com.ssafy.ozz.clothes.category.domain.CategoryHigh;
import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.category.exception.CategoryNotFoundException;
import com.ssafy.ozz.clothes.category.repository.CategoryHighRepository;
import com.ssafy.ozz.clothes.category.repository.CategoryLowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryHighRepository categoryHighRepository;
    private final CategoryLowRepository categoryLowRepository;

    @Override
    public CategoryHigh getCategoryHigh(Long categoryHighId) {
        return categoryHighRepository.findById(categoryHighId).orElseThrow(CategoryNotFoundException::new);
    }

    @Override
    public List<CategoryHigh> getAllCategoryHigh() {
        return categoryHighRepository.findAll();
    }

    @Override
    public CategoryLow getCategoryLow(Long categoryLowId) {
        return categoryLowRepository.findById(categoryLowId).orElseThrow(CategoryNotFoundException::new);
    }
}
