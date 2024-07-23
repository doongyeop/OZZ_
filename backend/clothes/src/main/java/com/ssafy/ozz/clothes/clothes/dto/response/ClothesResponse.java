package com.ssafy.ozz.clothes.clothes.dto.response;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.properties.*;
import com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

public record ClothesResponse(
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
                EnumBitwiseConverter.getEnumsFromInteger(Color.class, clothes.getColor()),
                EnumBitwiseConverter.getEnumsFromInteger(Texture.class, clothes.getTexture()),
                EnumBitwiseConverter.getEnumsFromInteger(Season.class, clothes.getSeason()),
                EnumBitwiseConverter.getEnumsFromInteger(Style.class, clothes.getStyle()),
                clothes.getCategoryLow()
        );
    }
}