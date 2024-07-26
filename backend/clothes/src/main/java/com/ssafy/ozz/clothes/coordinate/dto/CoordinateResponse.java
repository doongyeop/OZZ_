package com.ssafy.ozz.clothes.coordinate.dto;

import com.ssafy.ozz.clothes.clothes.dto.response.ClothesBasicResponse;
import com.ssafy.ozz.clothes.clothes.properties.Style;
import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toEnums;

public record CoordinateResponse (
        String name,
        List<Style> styleList,
        LocalDateTime createdDate,
        List<ClothesBasicResponse> clothesList,
        // TODO: File DTO로 반환하기
        Long imageFileId
){
    public CoordinateResponse(Coordinate coordinate){
        this(
            coordinate.getName(),
            toEnums(Style.class, coordinate.getStyle()),
            coordinate.getCreatedDate(),
            coordinate.getCoordinateClothesList().stream().map(coordinateClothes ->
                    new ClothesBasicResponse(coordinateClothes.getClothes())
            ).toList(),
            coordinate.getImageFileId()
        );
    }
}
