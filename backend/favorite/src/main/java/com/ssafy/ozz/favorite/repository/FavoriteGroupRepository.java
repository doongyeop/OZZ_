package com.ssafy.ozz.favorite.repository;

import com.ssafy.ozz.favorite.domain.FavoriteGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteGroupRepository extends JpaRepository<FavoriteGroup, Long> {
}
