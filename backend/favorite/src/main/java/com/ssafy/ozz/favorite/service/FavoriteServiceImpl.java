package com.ssafy.ozz.favorite.service;

import com.ssafy.ozz.favorite.domain.Favorite;
import com.ssafy.ozz.favorite.domain.FavoriteGroup;
import com.ssafy.ozz.favorite.repository.FavoriteGroupRepository;
import com.ssafy.ozz.favorite.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final FavoriteGroupRepository favoriteGroupRepository;
    private final CoordinateRepository coordinateRepository;

    @Override
    public Favorite addFavorite(Long favoriteGroupId, Long coordinateId) {
        FavoriteGroup favoriteGroup = favoriteGroupRepository.findById(favoriteGroupId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid favorite group ID"));
        Coordinate coordinate = coordinateRepository.findById(coordinateId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid coordinate ID"));

        Favorite favorite = Favorite.builder()
                .favoriteGroup(favoriteGroup)
                .coordinate(coordinate)
                .build();

        return favoriteRepository.save(favorite);
    }

    @Override
    public void deleteFavorite(Long favoriteGroupId, Long coordinateId) {
        Favorite favorite = favoriteRepository.findAllByFavoriteGroup(favoriteGroupRepository.findById(favoriteGroupId).orElseThrow(() -> new IllegalArgumentException("Invalid favorite group ID")))
                .stream()
                .filter(f -> f.getCoordinate().getCoordinateId().equals(coordinateId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }

    @Override
    public void deleteFavoriteGroup(Long favoriteGroupId) {
        favoriteGroupRepository.deleteById(favoriteGroupId);
    }

    @Override
    public List<Favorite> getFavoritesByGroup(Long favoriteGroupId) {
        FavoriteGroup favoriteGroup = favoriteGroupRepository.findById(favoriteGroupId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid favorite group ID"));
        return favoriteRepository.findAllByFavoriteGroup(favoriteGroup);
    }

    @Override
    public FavoriteGroup createFavoriteGroup(FavoriteGroup favoriteGroup) {
        return favoriteGroupRepository.save(favoriteGroup);
    }
}
