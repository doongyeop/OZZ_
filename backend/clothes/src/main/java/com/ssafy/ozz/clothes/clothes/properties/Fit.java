package com.ssafy.ozz.clothes.clothes.properties;

import lombok.Getter;

@Getter
public enum Fit {
    OVERSIZE("오버핏"),
    LARGE("커요"),
    SLIGHTLY_LARGE("조금 커요"),
    FIT("딱 맞아요"),
    SLIGHTLY_SMALL("조금 작아요"),
    SMALL("작아요"),
    VERY_SMALL("엄청 작아요");

    private final String displayName;

    Fit(String displayName) {
        this.displayName = displayName;
    }

    public Byte toByte(){
        return (byte) ordinal();
    }
}
