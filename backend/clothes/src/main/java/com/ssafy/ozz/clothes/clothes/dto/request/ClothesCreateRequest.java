package com.ssafy.ozz.clothes.clothes.dto.request;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.properties.*;
import com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "옷 생성 요청 DTO")
public record ClothesCreateRequest(
        String name,
        Size size,
        Fit fit,
        String memo,
        String brand,
        LocalDate purchaseDate,
        String purchaseSite,
        List<Color> colorList,
        List<Texture> textureList,
        List<Season> seasonList,
        List<Style> styleList,
        Long categoryLowId
) {
    public Clothes toEntity(CategoryLow categoryLow, Long imageFileId, Long userId) {
        return Clothes.builder()
                .name(name)
                .size(size)
                .fit(fit)
                .memo(memo)
                .brand(brand)
                .purchaseDate(purchaseDate)
                .purchaseSite(purchaseSite)
                .color(EnumBitwiseConverter.toBits(colorList))
                .texture(EnumBitwiseConverter.toBits(textureList))
                .style(EnumBitwiseConverter.toBits(styleList))
                .season(EnumBitwiseConverter.toBits(seasonList))
                .categoryLow(categoryLow)
                .imageFileId(imageFileId)
                .userId(userId)
                .build();
    }
}
