package com.ssafy.ozz.clothes.clothes.dto.request;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.properties.*;
import com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class ClothesCreateRequest {
    private String name;

    private Size size;

    private Fit fit;

    private String memo;

    private String brand;

    private LocalDateTime purchaseDate;

    private String purchaseSite;

    private List<Color> colorList;

    private List<Texture> textureList;

    private List<Season> seasonList;

    private List<Style> styleList;

    /* FOREIGN KEY */
    Long categoryLowId;

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