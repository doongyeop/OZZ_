package com.ssafy.ozz.clothes.coordinate.dto.response;

import com.ssafy.ozz.clothes.clothes.properties.Style;
import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import com.ssafy.ozz.clothes.coordinate.domain.CoordinateDocument;
import com.ssafy.ozz.clothes.global.fegin.file.dto.FeignFileInfo;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toEnums;

@Builder
public record CoordinateBasicResponse(
        Long coordinateId,
        String name,
        List<Style> styleList,
        LocalDateTime createdDate,
        FeignFileInfo imageFile
){
    public static CoordinateBasicResponse of(Coordinate coordinate, FeignFileInfo file){
        return CoordinateBasicResponse.builder()
                .coordinateId(coordinate.getCoordinateId())
                .name(coordinate.getName())
                .styleList(toEnums(Style.class, coordinate.getStyle()))
                .createdDate(coordinate.getCreatedDate())
                .imageFile(file)
                .build();
    }

    public CoordinateBasicResponse(CoordinateDocument coordinate, FeignFileInfo file){
        this(
                coordinate.getCoordinateId(),
                coordinate.getName(),
                toEnums(Style.class, coordinate.getStyle()),
                coordinate.getCreatedDate(),
                file
        );
    }
}
