package com.ssafy.ozz.clothes.clothes.repository;

import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClothesRepository extends JpaRepository<Clothes,Long> {
}
