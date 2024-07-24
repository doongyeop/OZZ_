package com.ssafy.ozz.clothes.coordinate.service;

import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.service.ClothesService;
import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateCreateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateUpdateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.SearchCondition;
import com.ssafy.ozz.clothes.coordinate.repository.CoordinateClothesRepository;
import com.ssafy.ozz.clothes.coordinate.repository.CoordinateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CoordinateServiceImpl implements CoordinateService {
    private final CoordinateRepository coordinateRepository;
    private final CoordinateClothesRepository coordinateClothesRepository;
    private final ClothesService clothesService;

    @Override
    public Long createCoordinate(Long userId, MultipartFile imageFile, CoordinateCreateRequest request) {
        // TODO: image file 저장 및 id 받아오기
        Long imageFileId = 1L;

        Coordinate coordinate = request.toEntity(userId,imageFileId);
        coordinateRepository.save(coordinate);

        request.clothes().forEach((coordinateClothes)-> {
            Clothes clothes = clothesService.getClothes(coordinateClothes.clothesId());
            coordinateClothesRepository.save(coordinateClothes.toEntity(coordinate, clothes));
        });

        return coordinate.getCoordinateId();
    }

    @Override
    @Transactional(readOnly = true)
    public Coordinate getCoordinate(Long coordinateId) {
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Coordinate> getCoordinatesOfUser(Long userId, SearchCondition condition) {
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<Coordinate> getCoordinatesOfUser(Long userId, SearchCondition condition, Pageable pageable) {
        return null;
    }

    @Override
    public Coordinate updateCoordinate(CoordinateUpdateRequest request) {
        return null;
    }

    @Override
    public void deleteCoordinate(Long coordinateId) {

    }
}
