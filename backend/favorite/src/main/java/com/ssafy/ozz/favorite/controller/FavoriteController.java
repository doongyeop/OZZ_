package com.ssafy.ozz.favorite.controller;

import com.ssafy.ozz.favorite.domain.Favorite;
import com.ssafy.ozz.favorite.domain.FavoriteGroup;
import com.ssafy.ozz.favorite.dto.response.FavoriteGroupBasicResponse;
import com.ssafy.ozz.favorite.dto.response.FavoriteResponse;
import com.ssafy.ozz.favorite.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    @Operation(summary = "즐겨찾기 그룹 생성", description = "새로운 즐겨찾기 그룹을 생성합니다.")
    public ResponseEntity<FavoriteGroup> createFavoriteGroup(@RequestBody FavoriteGroup favoriteGroup) {
        FavoriteGroup createdFavoriteGroup = favoriteService.createFavoriteGroup(favoriteGroup);
        return new ResponseEntity<>(createdFavoriteGroup, HttpStatus.CREATED);
    }

    @PostMapping("/{favoriteGroupId}/coordinate")
    @Operation(summary = "즐겨찾기 그룹에 코디 추가", description = "즐겨찾기 그룹에 새로운 코디를 추가합니다.")
    public ResponseEntity<Favorite> addFavorite(@PathVariable Long favoriteGroupId, @RequestParam Long coordinateId) {
        Favorite createdFavorite = favoriteService.addFavorite(favoriteGroupId, coordinateId);
        return new ResponseEntity<>(createdFavorite, HttpStatus.CREATED);
    }

    @DeleteMapping("/{favoriteGroupId}/coordinate")
    @Operation(summary = "즐겨찾기 코디 삭제", description = "즐겨찾기 그룹에서 특정 코디를 삭제합니다.")
    public ResponseEntity<Void> deleteFavorite(@PathVariable Long favoriteGroupId, @RequestParam Long coordinateId) {
        favoriteService.deleteFavorite(favoriteGroupId, coordinateId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{favoriteGroupId}")
    @Operation(summary = "즐겨찾기 삭제", description = "특정 즐겨찾기 그룹을 삭제합니다.")
    public ResponseEntity<Void> deleteFavoriteGroup(@PathVariable Long favoriteGroupId) {
        favoriteService.deleteFavoriteGroup(favoriteGroupId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{favoriteGroupId}")
    @Operation(summary = "즐겨찾기 상세 코디 목록 조회", description = "특정 즐겨찾기 그룹의 코디 목록을 조회합니다.")
    public ResponseEntity<List<FavoriteResponse>> getFavoritesByGroup(@PathVariable Long favoriteGroupId) {
        return new ResponseEntity<>(favoriteService.getFavoriteResponseListByGroup(favoriteGroupId), HttpStatus.OK);
    }

    @GetMapping("/users")
    @Operation(summary = "즐겨찾기 목록 조회", description = "특정 즐겨찾기 그룹의 코디 목록을 조회합니다.")
    public ResponseEntity<List<FavoriteGroupBasicResponse>> getFavoritesGroupListOfUsers(@Parameter(hidden = true) @RequestHeader("X-User-Id") Long userId) {
        return new ResponseEntity<>(favoriteService.getFavoriteGroupResponseListOfUser(userId), HttpStatus.OK);
    }
}
