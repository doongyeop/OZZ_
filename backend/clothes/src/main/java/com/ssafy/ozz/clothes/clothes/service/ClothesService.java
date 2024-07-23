package com.ssafy.ozz.clothes.clothes.service;

import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesCreateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesUpdateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.SearchCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface ClothesService {
    Clothes getClothes(Long clothesId);

    Slice<Clothes> getClothesOfUser(Long userId, Pageable pageable);

    Slice<Clothes> getClothesOfUser(Long userId, SearchCondition condition, Pageable pageable);

    Long saveClothes(Long userId, ClothesCreateRequest request);

    Page<Clothes> searchClothes(SearchCondition condition, Pageable pageable);

    void updateClothes(Long clothesId, ClothesUpdateRequest request);

    void deleteClothes(Long clothesId);

    List<Clothes> getClothesInCoordinate(Long coordinateId);

    List<Clothes> getClothesInRecCoordinate(Long coordinateId);
}
