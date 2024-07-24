package com.ssafy.ozz.clothes.coordinate.dto;

import com.ssafy.ozz.clothes.clothes.properties.Style;
import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import lombok.Builder;

import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toBits;

@Builder
public record CoordinateCreateRequest (
    String name,
    List<Style> styleList,
    List<CoordinateClothesCreateRequest> clothes
){
    public Coordinate toEntity(Long userId, Long imageFileId){
        return Coordinate.builder()
                .name(name)
                .style(toBits(styleList))
                .build();
    }
}