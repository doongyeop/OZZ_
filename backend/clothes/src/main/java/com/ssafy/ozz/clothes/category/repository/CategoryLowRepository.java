package com.ssafy.ozz.clothes.category.repository;

import com.ssafy.ozz.clothes.category.domain.CategoryHigh;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryLowRepository extends JpaRepository<CategoryHigh, Long> {
}
