package com.ssafy.ozz.clothes.clothes.service;

import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.dto.ClothesCreateRequest;
import com.ssafy.ozz.clothes.clothes.dto.ClothesUpdateRequest;
import com.ssafy.ozz.clothes.clothes.dto.SearchCondition;
import org.springframework.data.domain.Page;

import java.awt.print.Pageable;
import java.util.List;

public interface ClothesService {
    Clothes getClothes(Long clothesId);

    Long saveClothes(Long userId, ClothesCreateRequest request);

    Page<Clothes> searchClothes(SearchCondition condition, Pageable pageable);

    void updateClothes(Long clothesId, ClothesUpdateRequest request);

    void deleteClothes(Long clothesId);

    List<Clothes> getClothesInCoordinate(Long coordinateId);

    List<Clothes> getClothesInRecCoordinate(Long coordinateId);
}
