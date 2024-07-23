package com.ssafy.ozz.clothes.clothes.controller;

import com.ssafy.ozz.clothes.clothes.dto.request.ClothesCreateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesUpdateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.SearchCondition;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesBasicResponse;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesResponse;
import com.ssafy.ozz.clothes.clothes.service.ClothesService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/clothes")
public class ClothesController {
    private final ClothesService clothesService;

    @PostMapping
    public ResponseEntity<Long> addClothes(@RequestBody ClothesCreateRequest request) {
//        Long userId = (Long) authentication.getPrincipal();
        // TODO : 실제 유저 번호 받아오기
        Long userId = 1L;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clothesService.saveClothes(userId, request));
    }

    @GetMapping("/{clothesId}")
    public ResponseEntity<ClothesResponse> getClothes(@PathVariable Long clothesId) {
        return ResponseEntity.ok(new ClothesResponse(clothesService.getClothes(clothesId)));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Slice<ClothesBasicResponse>> getClothesOfUser(@PathVariable Long userId, @ModelAttribute SearchCondition condition, Pageable pageable) {
        return ResponseEntity.ok(clothesService.getClothesOfUser(userId, condition, pageable).map(ClothesBasicResponse::new));
    }

    @PutMapping("/{clothesId}")
    public ResponseEntity<ClothesResponse> updateClothes(@PathVariable Long clothesId, @RequestBody ClothesUpdateRequest request) {
        return ResponseEntity.ok().body(new ClothesResponse(clothesService.updateClothes(clothesId, request)));
    }

    @DeleteMapping("/{clothesId}")
    public ResponseEntity<Void> deleteClothes(@PathVariable Long clothesId) {
        clothesService.deleteClothes(clothesId);
        return ResponseEntity.noContent().build();
    }
}
