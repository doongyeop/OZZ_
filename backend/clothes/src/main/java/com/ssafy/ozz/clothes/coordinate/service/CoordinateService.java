package com.ssafy.ozz.clothes.coordinate.service;

import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateCreateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateUpdateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.SearchCondition;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CoordinateService {
    Coordinate createCoordinate(Long userId, MultipartFile imageFile, CoordinateCreateRequest request);

    Coordinate getCoordinate(Long coordinateId);

    List<Coordinate> getCoordinatesOfUser(Long userId, SearchCondition condition);

    Slice<Coordinate> getCoordinatesOfUser(Long userId, SearchCondition condition, Pageable pageable);

    Coordinate updateCoordinate(Long coordinateId, CoordinateUpdateRequest request);

    void deleteCoordinate(Long coordinateId);
}
