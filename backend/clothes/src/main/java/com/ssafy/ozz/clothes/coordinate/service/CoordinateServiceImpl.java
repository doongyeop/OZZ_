package com.ssafy.ozz.clothes.coordinate.service;

import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateCreateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateUpdateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.SearchCondition;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.util.List;

public class CoordinateServiceImpl implements CoordinateService {
    @Override
    public Long createCoordinate(CoordinateCreateRequest request) {
        return 0L;
    }

    @Override
    public Coordinate getCoordinate(Long coordinateId) {
        return null;
    }

    @Override
    public List<Coordinate> getCoordinatesOfUser(Long userId, SearchCondition condition) {
        return List.of();
    }

    @Override
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
