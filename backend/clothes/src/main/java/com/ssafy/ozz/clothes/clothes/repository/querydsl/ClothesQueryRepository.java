package com.ssafy.ozz.clothes.clothes.repository.querydsl;

import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesSearchCondition;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface ClothesQueryRepository {
    Slice<Clothes> findByUserId(Long userId, ClothesSearchCondition condition, Pageable pageable);
}
