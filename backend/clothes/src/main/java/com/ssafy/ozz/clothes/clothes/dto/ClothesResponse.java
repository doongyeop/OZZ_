package com.ssafy.ozz.clothes.clothes.dto;

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
@ToString
public class ClothesResponse {
    private final String name;

    private final Size size;

    private final Fit fit;

    private final String memo;

    private final String brand;

    private final LocalDateTime purchaseDate;

    private final String purchaseSite;

    private final List<Color> colorList;

    private final List<Texture> textureList;

    private final List<Season> seasonList;

    private final List<Style> styleList;

    /* FOREIGN KEY */
    private final CategoryLow categoryLow;

    public ClothesResponse(Clothes clothes) {
        this.name = clothes.getName();
        this.size = clothes.getSize();
        this.fit = clothes.getFit();
        this.memo = clothes.getMemo();
        this.brand = clothes.getBrand();
        this.purchaseDate = clothes.getPurchaseDate();
        this.purchaseSite = clothes.getPurchaseSite();
        this.colorList = EnumBitwiseConverter.getEnumsFromInteger(Color.class, clothes.getColor());
        this.textureList = EnumBitwiseConverter.getEnumsFromInteger(Texture.class, clothes.getTexture());
        this.seasonList = EnumBitwiseConverter.getEnumsFromInteger(Season.class, clothes.getSeason());
        this.styleList = EnumBitwiseConverter.getEnumsFromInteger(Style.class, clothes.getStyle());
        this.categoryLow = clothes.getCategoryLow();
    }
}