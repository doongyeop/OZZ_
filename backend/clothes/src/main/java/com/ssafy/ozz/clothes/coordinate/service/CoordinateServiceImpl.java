package com.ssafy.ozz.clothes.coordinate.service;

import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.service.ClothesService;
import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import com.ssafy.ozz.clothes.coordinate.domain.CoordinateClothes;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateClothesCreateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateCreateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateUpdateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.SearchCondition;
import com.ssafy.ozz.clothes.coordinate.exception.CoordinateNotFoundException;
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
    public Coordinate createCoordinate(Long userId, MultipartFile imageFile, CoordinateCreateRequest request) {
        // TODO: image file 저장 및 id 받아오기
        Long imageFileId = 1L;

        Coordinate coordinate = request.toEntity(userId,imageFileId);
        coordinateRepository.save(coordinate);
        saveCoordinateClothesList(coordinate, request.clothesList());

        return coordinate;
    }

    @Override
    @Transactional(readOnly = true)
    public Coordinate getCoordinate(Long coordinateId) {
        return coordinateRepository.findById(coordinateId).orElseThrow(CoordinateNotFoundException::new);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Coordinate> getCoordinatesOfUser(Long userId, SearchCondition condition) {
        return coordinateRepository.findByUserId(userId, condition);
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<Coordinate> getCoordinatesOfUser(Long userId, SearchCondition condition, Pageable pageable) {
        return coordinateRepository.findByUserId(userId, condition, pageable);
    }

    @Override
    public Coordinate updateCoordinate(Long coordinateId, CoordinateUpdateRequest request) {
        Coordinate coordinate = getCoordinate(coordinateId);
        coordinate.updateName(request.name());
        coordinate.updateStyle(request.styleList());

        coordinateClothesRepository.deleteAll(coordinateClothesRepository.findByCoordinate(coordinate));
        coordinate.setCoordinateClothesList(saveCoordinateClothesList(coordinate, request.clothesList()));

        return coordinate;
    }

    @Override
    public void deleteCoordinate(Long coordinateId) {
        coordinateClothesRepository.deleteAll(coordinateClothesRepository.findByCoordinateId(coordinateId));
        coordinateRepository.deleteById(coordinateId);
    }

    private List<CoordinateClothes> saveCoordinateClothesList(Coordinate coordinate, List<CoordinateClothesCreateRequest> clothesList) {
        return coordinateClothesRepository.saveAll(clothesList.stream().map(coordinateClothes-> {
            Clothes clothes = clothesService.getClothes(coordinateClothes.clothesId());
            return coordinateClothes.toEntity(coordinate, clothes);
        }).toList());
    }
}
