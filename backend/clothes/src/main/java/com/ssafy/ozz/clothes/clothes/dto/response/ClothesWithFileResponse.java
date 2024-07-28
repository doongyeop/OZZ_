package com.ssafy.ozz.clothes.clothes.dto.response;

import com.ssafy.ozz.clothes.category.dto.CategoryLowResponse;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.properties.*;
import com.ssafy.ozz.clothes.global.fegin.file.dto.FeignFileInfo;
import com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toEnums;

@Schema(description = "옷 상세 정보 DTO with 파일 DTO")
public record ClothesWithFileResponse(
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
        List<Pattern> patternList,
        CategoryLowResponse categoryLow,
        FeignFileInfo imageFile
) {
    public ClothesWithFileResponse(Clothes clothes, FeignFileInfo fileInfo) {
        this(
                clothes.getName(),
                clothes.getSize(),
                clothes.getFit(),
                clothes.getMemo(),
                clothes.getBrand(),
                clothes.getPurchaseDate(),
                clothes.getPurchaseSite(),
                toEnums(Color.class, clothes.getColor()),
                toEnums(Texture.class, clothes.getTexture()),
                toEnums(Season.class, clothes.getSeason()),
                toEnums(Style.class, clothes.getStyle()),
                toEnums(Pattern.class, clothes.getPattern()),
                new CategoryLowResponse(clothes.getCategoryLow()),
                fileInfo
        );
    }
}
