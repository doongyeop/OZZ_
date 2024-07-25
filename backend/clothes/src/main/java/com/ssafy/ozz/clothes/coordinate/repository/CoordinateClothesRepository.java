package com.ssafy.ozz.clothes.coordinate.repository;

import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import com.ssafy.ozz.clothes.coordinate.domain.CoordinateClothes;
import com.ssafy.ozz.clothes.coordinate.domain.CoordinateClothesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoordinateClothesRepository extends JpaRepository<CoordinateClothes, CoordinateClothesId> {
    List<CoordinateClothes> findByCoordinate(Coordinate coordinate);
}
