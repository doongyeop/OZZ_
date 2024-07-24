package com.ssafy.ozz.clothes.coordinate.service;

import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateCreateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateUpdateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.SearchCondition;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface CoordinateService {
    Long createCoordinate(Long userId, Long imageFileId, CoordinateCreateRequest request);

    Coordinate getCoordinate(Long coordinateId);

    List<Coordinate> getCoordinatesOfUser(Long userId, SearchCondition condition);

    Slice<Coordinate> getCoordinatesOfUser(Long userId, SearchCondition condition, Pageable pageable);

    Coordinate updateCoordinate(CoordinateUpdateRequest request);

    void deleteCoordinate(Long coordinateId);
}
