package com.ssafy.ozz.clothes.clothes.repository;

import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClothesRepository extends JpaRepository<Clothes,Long> {
    Slice<Clothes> findByUserId(Long userId, Pageable pageable);
    @Query("select c from Clothes c where c.userId = :userId and c.categoryLow.categoryLowId = :categoryLowId")
    Slice<Clothes> findByUserIdAndCategoryLowId(@Param("userId") Long userId, @Param("categoryLowId") Long categoryLowId, Pageable pageable);
    @Query("select c from Clothes c where c.userId = :userId and c.categoryLow.categoryHigh.categoryHighId = :categoryHighId")
    Slice<Clothes> findByUserIdAndCategoryHighId(@Param("userId") Long userId, @Param("categoryHighId") Long categoryHighId, Pageable pageable);
}
