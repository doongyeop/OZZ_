package com.ssafy.ozz.favorite.service;

import com.ssafy.ozz.favorite.domain.Favorite;
import com.ssafy.ozz.favorite.domain.FavoriteGroup;
import com.ssafy.ozz.favorite.dto.request.FavoriteGroupCreateRequest;
import com.ssafy.ozz.favorite.dto.request.FavoriteListDeleteRequest;
import com.ssafy.ozz.favorite.dto.response.FavoriteGroupBasicResponse;
import com.ssafy.ozz.favorite.dto.response.FavoriteResponse;

import java.util.List;

public interface FavoriteService {
    Favorite addFavorite(Long favoriteGroupId, Long coordinateId);
    void deleteFavorite(Long favoriteGroupId, Long coordinateId);
    void deleteFavoriteList(Long favoriteGroupId, FavoriteListDeleteRequest request);
    void deleteFavoriteGroup(Long favoriteGroupId);
    List<Favorite> getFavoritesByGroup(Long favoriteGroupId);
    FavoriteGroup createFavoriteGroup(FavoriteGroup favoriteGroup);
}
