package com.ssafy.ozz.clothes.clothes.controller;

import com.ssafy.ozz.clothes.clothes.dto.ClothesCreateRequest;
import com.ssafy.ozz.clothes.clothes.dto.ClothesResponse;
import com.ssafy.ozz.clothes.clothes.service.ClothesService;
import lombok.RequiredArgsConstructor;
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
}
