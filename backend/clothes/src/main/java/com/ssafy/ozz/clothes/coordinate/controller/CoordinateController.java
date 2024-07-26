package com.ssafy.ozz.clothes.coordinate.controller;

import com.ssafy.ozz.clothes.coordinate.dto.CoordinateCreateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateResponse;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateUpdateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.SearchCondition;
import com.ssafy.ozz.clothes.coordinate.service.CoordinateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/coordinates")
public class CoordinateController {
    private final CoordinateService coordinateService;

    @PostMapping(consumes = {"multipart/form-data","application/json"})
    public ResponseEntity<Long> createCoordinate(@RequestPart final MultipartFile imageFile, @RequestPart final CoordinateCreateRequest request) {
        // TODO: 실제 유저 번호 받아오기
        Long userId = 1L;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(coordinateService.createCoordinate(userId,imageFile,request).getCoordinateId());
    }

    @GetMapping("/{coordinateId}")
    public ResponseEntity<CoordinateResponse> getCoordinate(@PathVariable final Long coordinateId) {
        return ResponseEntity.ok(new CoordinateResponse(coordinateService.getCoordinate(coordinateId)));
    }

    @GetMapping
    public ResponseEntity<Slice<CoordinateResponse>> getCoordinateList(@ModelAttribute SearchCondition condition, Pageable pageable) {
        // TODO: 실제 유저 번호 받아오기
        Long userId = 1L;
        return ResponseEntity.ok(coordinateService.getCoordinatesOfUser(userId,condition,pageable).map(CoordinateResponse::new));
    }

    @PutMapping(path = "/{coordinateId}", consumes = {"multipart/form-data","application/json"})
    public ResponseEntity<CoordinateResponse> updateCoordinate(@PathVariable final Long coordinateId, @RequestPart final MultipartFile imageFile, @RequestPart final CoordinateUpdateRequest request) {
        return ResponseEntity.ok(new CoordinateResponse(coordinateService.updateCoordinate(coordinateId,imageFile,request)));
    }
}