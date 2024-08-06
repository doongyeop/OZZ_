package com.ssafy.ozz.clothes.coordinate.dto.response;

import com.ssafy.ozz.clothes.clothes.properties.Style;
import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import com.ssafy.ozz.clothes.coordinate.domain.CoordinateDocument;
import com.ssafy.ozz.clothes.global.fegin.file.dto.FeignFileInfo;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toEnums;

public record CoordinateBasicResponse(
        Long coordinateId,
        String name,
        List<Style> styleList,
        LocalDateTime createdDate,
        FeignFileInfo imageFile
){
    public CoordinateBasicResponse(Coordinate coordinate, FeignFileInfo file){
        this(
            coordinate.getCoordinateId(),
            coordinate.getName(),
            toEnums(Style.class, coordinate.getStyle()),
            coordinate.getCreatedDate(),
            file
        );
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
