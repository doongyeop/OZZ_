package com.ssafy.ozz.clothes.clothes.dto.request;

import com.ssafy.ozz.clothes.clothes.properties.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "옷 수정 요청 DTO")
public record ClothesUpdateRequest(
        Long categoryLowId,
        String name,
        Size size,
        Fit fit,
        String memo,
        String brand,
        LocalDateTime purchaseDate,
        String purchaseSite,
        List<Color> colorList,
        List<Texture> textureList,
        List<Season> seasonList,
        List<Style> styleList
) {
}
