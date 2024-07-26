package com.ssafy.ozz.clothes.clothes.controller;

import com.ssafy.ozz.clothes.clothes.dto.request.ClothesCreateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesUpdateRequest;
import com.ssafy.ozz.clothes.clothes.dto.request.SearchCondition;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesBasicResponse;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesResponse;
import com.ssafy.ozz.clothes.clothes.dto.response.ColorResponse;
import com.ssafy.ozz.clothes.clothes.dto.response.PropertyResponse;
import com.ssafy.ozz.clothes.clothes.properties.*;
import com.ssafy.ozz.clothes.clothes.service.ClothesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/clothes")
@Tag(name = "Clothes API", description = "옷 관리 API")
public class ClothesController {
    private final ClothesService clothesService;

    @PostMapping
    @Operation(summary = "새 옷 추가", description = "데이터베이스에 새 옷을 추가합니다.")
    public ResponseEntity<Long> addClothes(@RequestPart MultipartFile imageFile, @RequestPart ClothesCreateRequest request) {
//        Long userId = (Long) authentication.getPrincipal();
        // TODO : 실제 유저 번호 받아오기
        Long userId = 1L;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clothesService.saveClothes(userId, imageFile, request));
    }

    @GetMapping("/{clothesId}")
    @Operation(summary = "옷 상세 조회", description = "ID를 통해 특정 옷의 세부 정보를 조회합니다.")
    public ResponseEntity<ClothesResponse> getClothes(@PathVariable Long clothesId) {
        return ResponseEntity.ok(new ClothesResponse(clothesService.getClothes(clothesId)));
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "사용자의 옷 조회", description = "특정 사용자의 옷 목록을 슬라이스 형태로 조회합니다.")
    public ResponseEntity<Slice<ClothesBasicResponse>> getClothesOfUser(
            @PathVariable Long userId,
            @ModelAttribute SearchCondition condition,
            Pageable pageable) {
        return ResponseEntity.ok(clothesService.getClothesOfUser(userId, condition, pageable).map(ClothesBasicResponse::new));
    }

    @PutMapping("/{clothesId}")
    @Operation(summary = "옷 정보 수정", description = "ID를 통해 특정 옷의 세부 정보를 수정합니다.")
    public ResponseEntity<ClothesResponse> updateClothes(
            @PathVariable Long clothesId,
            @RequestBody ClothesUpdateRequest request) {
        return ResponseEntity.ok().body(new ClothesResponse(clothesService.updateClothes(clothesId, request)));
    }

    @DeleteMapping("/{clothesId}")
    @Operation(summary = "옷 삭제", description = "ID를 통해 특정 옷을 삭제합니다.")
    public ResponseEntity<Void> deleteClothes(@PathVariable Long clothesId) {
        clothesService.deleteClothes(clothesId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/properties/colors")
    @Operation(summary = "색상 목록 정보 조회", description = "색상 목록 정보를 조회합니다.")
    public ResponseEntity<List<ColorResponse>> getColorList() {
        return ResponseEntity.ok().body(Arrays.stream(Color.values()).map(ColorResponse::new).toList());
    }

    @GetMapping("/properties")
    @Operation(summary = "옷 속성 목록 정보 조회", description = "옷 속성 목록 정보를 조회합니다. [FIT, SEASON, SIZE, STYLE, TEXTURE] 중 택1")
    public ResponseEntity<List<PropertyResponse>> getPropertyList(@RequestParam("property") PropertySelector property) {
        return ResponseEntity.ok()
                .body(Arrays.stream(property.getPropertyClass().getEnumConstants()).map(PropertyResponse::new).toList());
    }
}
