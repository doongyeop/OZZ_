package com.ssafy.ozz.clothes.clothes.service;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.category.service.CategoryService;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesCreateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesUpdateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.SearchCondition;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesBasicWithFileResponse;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesWithFileResponse;
import com.ssafy.ozz.clothes.clothes.exception.ClothesNotFoundException;
import com.ssafy.ozz.clothes.clothes.repository.ClothesRepository;
import com.ssafy.ozz.clothes.global.fegin.file.FileClient;
import com.ssafy.ozz.clothes.global.fegin.file.dto.FeignFileInfo;
import com.ssafy.ozz.clothes.global.fegin.file.exception.FileNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toBits;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ClothesServiceImpl implements ClothesService {
    private final ClothesRepository clothesRepository;
    private final CategoryService categoryService;
    private final FileClient fileClient;

    @Override
    @Transactional(readOnly = true)
    public Clothes getClothes(Long clothesId) {
        return clothesRepository.findById(clothesId).orElseThrow(ClothesNotFoundException::new);
    }

    @Override
    public ClothesWithFileResponse getClothesWithFile(Long clothesId){
        Clothes clothes = getClothes(clothesId);
        return new ClothesWithFileResponse(clothes,fileClient.getFile(clothes.getImageFileId()).orElseThrow(FileNotFoundException::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ClothesBasicWithFileResponse> getClothesOfUserWithFile(Long userId, SearchCondition condition, Pageable pageable) {
        return clothesRepository.findByUserId(userId, condition, pageable).map(clothes -> {
            FeignFileInfo fileInfo = fileClient.getFile(clothes.getImageFileId()).orElseThrow(FileNotFoundException::new);
            return new ClothesBasicWithFileResponse(clothes, fileInfo);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<Clothes> getClothesOfUser(Long userId, SearchCondition condition, Pageable pageable) {
        return clothesRepository.findByUserId(userId, condition, pageable);
    }

    @Override
    public Clothes saveClothes(Long userId, MultipartFile imageFile, ClothesCreateRequest request) {
        CategoryLow categoryLow = categoryService.getCategoryLow(request.categoryLowId());
        // TODO : 이미지 파일 저장 후 id 값 가져오기
        log.debug(imageFile.toString());
        FeignFileInfo fileInfo = fileClient.uploadFile(imageFile).orElseThrow();
        log.debug(fileInfo.toString());

        Long imageFileId = fileInfo.fileId();
        return clothesRepository.save(request.toEntity(categoryLow,imageFileId,userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Clothes> searchClothes(SearchCondition condition, Pageable pageable) {
        // TODO : 다이나믹 서치 적용
        return null;
    }

    @Override
    public Clothes updateClothes(Long clothesId, ClothesUpdateRequest request) {
        Clothes clothes = getClothes(clothesId);
        if(request.categoryLowId() != null)
            clothes.changeCategoryLow(categoryService.getCategoryLow(request.categoryLowId()));
        clothes.changeName(request.name());
        clothes.changeSize(request.size());
        clothes.changeFit(request.fit());
        clothes.changeMemo(request.memo());
        clothes.changeBrand(request.brand());
        clothes.changePurchaseDate(request.purchaseDate());
        clothes.changePurchaseSite(request.purchaseSite());
        clothes.changeColor(toBits(request.colorList()));
        clothes.changeTexture(toBits(request.textureList()));
        clothes.changeSeason(toBits(request.seasonList()));
        clothes.changeStyle(toBits(request.styleList()));
        clothes.changePattern(toBits(request.patternList()));
        return clothes;
    }

    @Override
    public void deleteClothes(Long clothesId) {
        clothesRepository.deleteById(clothesId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Clothes> getClothesInCoordinate(Long coordinateId) {
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Clothes> getClothesInRecCoordinate(Long coordinateId) {
        return List.of();
    }
}
