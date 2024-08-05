package com.ssafy.ozz.clothes.clothes.service;

import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesBasicWithFileResponse;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesWithFileResponse;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesCreateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesUpdateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesSearchCondition;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ClothesService {
    Clothes getClothes(Long clothesId);
    ClothesWithFileResponse getClothesWithFile(Long clothesId);

    Slice<ClothesBasicWithFileResponse> getClothesOfUserWithFile(Long userId, ClothesSearchCondition condition, Pageable pageable);

    Slice<Clothes> getClothesOfUser(Long userId, ClothesSearchCondition condition, Pageable pageable);

    Clothes saveClothes(Long userId, MultipartFile imageFile, ClothesCreateRequest request);

    Slice<ClothesBasicWithFileResponse> searchClothes(ClothesSearchCondition condition, Pageable pageable);

    Clothes updateClothes(Long clothesId, ClothesUpdateRequest request);
    ClothesWithFileResponse updateClothes(Long clothesId, ClothesUpdateRequest request, MultipartFile imageFile);

    void deleteClothes(Long clothesId);

    List<Clothes> getClothesInCoordinate(Long coordinateId);

    List<Clothes> getClothesInRecCoordinate(Long coordinateId);
}
