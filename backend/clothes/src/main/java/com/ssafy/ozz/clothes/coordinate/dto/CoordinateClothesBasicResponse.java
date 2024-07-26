package com.ssafy.ozz.clothes.coordinate.dto;

import com.ssafy.ozz.clothes.clothes.dto.response.ClothesBasicResponse;
import com.ssafy.ozz.clothes.coordinate.domain.CoordinateClothes;

public record CoordinateClothesBasicResponse(
        ClothesBasicResponse clothes,
        Integer offset
){
    public CoordinateClothesBasicResponse(CoordinateClothes coordinateClothes){
        this(
            new ClothesBasicResponse(coordinateClothes.getClothes()),
            coordinateClothes.getOffset()
        );
    }
}
