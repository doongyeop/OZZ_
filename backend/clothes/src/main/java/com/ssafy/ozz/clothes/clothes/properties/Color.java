package com.ssafy.ozz.clothes.clothes.properties;

import lombok.Getter;

@Getter
public enum Color {
    BLACK("블랙", "#000000"),
    KHAKI("카키", "#F0E68C"),
    WHITE("화이트", "#FFFFFF"),
    MINT("민트", "#98FF98"),
    GREY("그레이", "#808080"),
    BLUE("블루", "#0000FF"),
    RED("레드", "#FF0000"),
    NAVY("네이비", "#000080"),
    PINK("핑크", "#FFC0CB"),
    SKYBLUE("스카이블루", "#87CEEB"),
    ORANGE("오렌지", "#FFA500"),
    PURPLE("퍼플", "#800080"),
    BEIGE("베이지", "#F5F5DC"),
    LAVENDER("라벤더", "#E6E6FA"),
    BROWN("브라운", "#A52A2A"),
    WINE("와인", "#722F37"),
    YELLOW("옐로우", "#FFFF00"),
    NEON("네온", "#39FF14"),
    GREEN("그린", "#008000"),
    GOLD("골드", "#FFD700");

    private final String displayName;
    private final String colorCode;

    Color(String displayName, String colorCode) {
        this.displayName = displayName;
        this.colorCode = colorCode;
    }
}
