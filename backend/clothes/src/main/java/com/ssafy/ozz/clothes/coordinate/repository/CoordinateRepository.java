package com.ssafy.ozz.clothes.coordinate.repository;

import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {
}
