package com.ssafy.ozz.clothes.clothes.controller;

import com.ssafy.ozz.clothes.clothes.dto.ClothesCreateRequest;
import com.ssafy.ozz.clothes.clothes.service.ClothesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
