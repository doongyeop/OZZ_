package com.ssafy.ozz.clothes.clothes.repository;

import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.repository.querydsl.ClothesQueryRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClothesRepository extends JpaRepository<Clothes,Long>, ClothesQueryRepository {
    Slice<Clothes> findByUserId(Long userId, Pageable pageable);
}
