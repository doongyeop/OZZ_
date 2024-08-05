package com.ssafy.ozz.clothes.clothes.dto.request;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;

import java.time.LocalDate;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toBits;

public record PurchaseHistory (
        String name,
        String brand,
        LocalDate purchaseDate,
        String purchaseSite,
        String imgUrl
) {
    public Clothes toEntity(Long userId) {
        return Clothes.builder()
                .name(name)
                .brand(brand)
                .purchaseDate(purchaseDate)
                .purchaseSite(purchaseSite)
                .userId(userId)
                .build();
    }
}