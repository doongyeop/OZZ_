package com.ssafy.ozz.clothes.category.controller;

import com.ssafy.ozz.clothes.category.dto.CategoryHighResponse;
import com.ssafy.ozz.clothes.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryHighResponse>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategoryHigh().stream().map(CategoryHighResponse::new).toList());
    }

    @GetMapping("/{categoryHighId}")
    public ResponseEntity<CategoryHighResponse> getCategoryHigh(@PathVariable Long categoryHighId) {
        return ResponseEntity.ok(new CategoryHighResponse(categoryService.getCategoryHigh(categoryHighId)));
    }
}