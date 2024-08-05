package com.ssafy.ozz.favorite.service;

import com.ssafy.ozz.favorite.domain.Favorite;
import com.ssafy.ozz.favorite.domain.FavoriteGroup;

import java.util.List;

public interface FavoriteService {
    Favorite addFavorite(Long favoriteGroupId, Long coordinateId);
    void deleteFavorite(Long favoriteGroupId, Long coordinateId);
    void deleteFavoriteGroup(Long favoriteGroupId);
    List<Favorite> getFavoritesByGroup(Long favoriteGroupId);
    FavoriteGroup createFavoriteGroup(FavoriteGroup favoriteGroup);
}
