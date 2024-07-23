package com.ssafy.ozz.clothes.clothes.service;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.category.service.CategoryService;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesCreateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesUpdateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.SearchCondition;
import com.ssafy.ozz.clothes.clothes.exception.ClothesNotFoundException;
import com.ssafy.ozz.clothes.clothes.repository.ClothesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClothesServiceImpl implements ClothesService {
    private final ClothesRepository clothesRepository;
    private final CategoryService categoryService;

    @Override
    public Clothes getClothes(Long clothesId) {
        return clothesRepository.findById(clothesId).orElseThrow(ClothesNotFoundException::new);
    }

    @Override
    public Slice<Clothes> getClothesOfUser(Long userId, org.springframework.data.domain.Pageable pageable) {
        return clothesRepository.findByUserId(userId,pageable);
    }

    @Override
    public Slice<Clothes> getClothesOfUser(Long userId, SearchCondition condition, Pageable pageable) {
        if(condition.categoryLowId() != null){
            return clothesRepository.findByUserIdAndCategoryLowId(userId, condition.categoryLowId(), pageable);
        }else if(condition.categoryHighId() != null){
            return clothesRepository.findByUserIdAndCategoryHighId(userId, condition.categoryHighId(), pageable);
        }else{
            return getClothesOfUser(userId, pageable);
        }
    }

    @Override
    public Long saveClothes(Long userId, ClothesCreateRequest request) {
        CategoryLow categoryLow = categoryService.getCategoryLow(request.categoryLowId());
        // TODO : 이미지 파일 저장 후 id 값 가져오기
        Long imageFileId = 1L;
        return clothesRepository.save(request.toEntity(categoryLow,imageFileId,userId)).getClothesId();
    }

    @Override
    public Page<Clothes> searchClothes(SearchCondition condition, Pageable pageable) {
        // TODO : 다이나믹 서치 적용
        return null;
    }

    @Override
    public void updateClothes(Long clothesId, ClothesUpdateRequest request) {
        Clothes clothes = getClothes(clothesId);
    }

    @Override
    public void deleteClothes(Long clothesId) {

    }

    @Override
    public List<Clothes> getClothesInCoordinate(Long coordinateId) {
        return List.of();
    }

    @Override
    public List<Clothes> getClothesInRecCoordinate(Long coordinateId) {
        return List.of();
    }
}
