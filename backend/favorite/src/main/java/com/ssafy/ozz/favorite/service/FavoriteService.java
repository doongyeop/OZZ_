package com.ssafy.ozz.favorite.service;

import com.ssafy.ozz.favorite.domain.Favorite;
import com.ssafy.ozz.favorite.domain.FavoriteGroup;
import com.ssafy.ozz.favorite.dto.response.FavoriteGroupBasicResponse;
import com.ssafy.ozz.favorite.dto.response.FavoriteResponse;

import java.util.List;

public interface FavoriteService {
    Favorite addFavorite(Long favoriteGroupId, Long coordinateId);
    void deleteFavorite(Long favoriteGroupId, Long coordinateId);
    void deleteFavoriteGroup(Long favoriteGroupId);
    List<Favorite> getFavoritesByGroup(Long favoriteGroupId);
    List<FavoriteResponse> getFavoriteResponseListByGroup(Long favoriteGroupId);
    List<FavoriteGroupBasicResponse> getFavoriteGroupResponseListOfUser(Long userId);
    FavoriteGroup createFavoriteGroup(FavoriteGroup favoriteGroup);
}
