package com.ssafy.ozz.clothes.clothes.dto.response;

import com.ssafy.ozz.clothes.category.dto.CategoryLowResponse;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.library.clothes.properties.*;

import java.util.List;

import static com.ssafy.ozz.library.util.EnumBitwiseConverter.toEnums;

public record ClothesForRecommendationResponse (
        Long id,
        Fit fit,
        List<Color> colorList,
        List<Texture> textureList,
        List<Season> seasonList,
        List<Style> styleList,
        List<Pattern> patternList,
        String extra,
        CategoryLowResponse categoryLow
){
    public ClothesForRecommendationResponse(Clothes clothes) {
        this(
                clothes.getClothesId(),
                clothes.getFit(),
                toEnums(Color.class, clothes.getColor()),
                toEnums(Texture.class, clothes.getTexture()),
                toEnums(Season.class, clothes.getSeason()),
                toEnums(Style.class, clothes.getStyle()),
                toEnums(Pattern.class, clothes.getPattern()),
                clothes.getExtra(),
                new CategoryLowResponse(clothes.getCategoryLow())
        );
    }
}
