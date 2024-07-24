package com.ssafy.ozz.clothes.clothes.dto.response;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.properties.*;
import com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "옷 상세정보 DTO")
public record ClothesResponse(
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
        CategoryLow categoryLow
) {
    public ClothesResponse(Clothes clothes) {
        this(
                clothes.getName(),
                clothes.getSize(),
                clothes.getFit(),
                clothes.getMemo(),
                clothes.getBrand(),
                clothes.getPurchaseDate(),
                clothes.getPurchaseSite(),
                EnumBitwiseConverter.toEnums(Color.class, clothes.getColor()),
                EnumBitwiseConverter.toEnums(Texture.class, clothes.getTexture()),
                EnumBitwiseConverter.toEnums(Season.class, clothes.getSeason()),
                EnumBitwiseConverter.toEnums(Style.class, clothes.getStyle()),
                clothes.getCategoryLow()
        );
    }
}