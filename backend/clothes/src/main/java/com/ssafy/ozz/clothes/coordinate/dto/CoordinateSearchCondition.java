package com.ssafy.ozz.clothes.coordinate.dto;

import com.ssafy.ozz.clothes.clothes.properties.Style;
import lombok.Builder;

import java.util.List;

@Builder
public record CoordinateSearchCondition(
    List<Style> styleList,
    Long favoriteGroupId,
    String keyword
){}