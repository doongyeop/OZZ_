package com.ssafy.ozz.favorite.service;

import com.ssafy.ozz.favorite.domain.Favorite;
import com.ssafy.ozz.favorite.domain.FavoriteGroup;
import com.ssafy.ozz.favorite.dto.response.FavoriteResponse;
import com.ssafy.ozz.favorite.global.feign.coordinate.CoordinateBasicResponse;
import com.ssafy.ozz.favorite.global.feign.coordinate.CoordinateClient;
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
    private final CoordinateClient coordinateClient;

    @Override
    public Favorite addFavorite(Long favoriteGroupId, Long coordinateId) {
        FavoriteGroup favoriteGroup = favoriteGroupRepository.findById(favoriteGroupId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid favorite group ID"));

        Favorite favorite = Favorite.builder()
                .favoriteGroup(favoriteGroup)
                .coordinateId(coordinateId)
                .build();

        return favoriteRepository.save(favorite);
    }

    @Override
    public void deleteFavorite(Long favoriteGroupId, Long coordinateId) {
        Favorite favorite = favoriteRepository.findAllByFavoriteGroup(favoriteGroupRepository.findById(favoriteGroupId).orElseThrow(() -> new IllegalArgumentException("Invalid favorite group ID")))
                .stream()
                .filter(f -> f.getCoordinateId().equals(coordinateId))
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
    public List<FavoriteResponse> getFavoriteResponseListByGroup(Long favoriteGroupId) {
        FavoriteGroup favoriteGroup = favoriteGroupRepository.findById(favoriteGroupId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid favorite group ID"));
        return favoriteRepository.findAllByFavoriteGroup(favoriteGroup).stream().map(favorite ->
            FavoriteResponse.of(favorite, coordinateClient.getCoordinate(favorite.getCoordinateId()).orElseThrow())
        ).toList();
    }

    @Override
    public FavoriteGroup createFavoriteGroup(FavoriteGroup favoriteGroup) {
        return favoriteGroupRepository.save(favoriteGroup);
    }
}
