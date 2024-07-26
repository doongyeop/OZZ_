package com.ssafy.ozz.clothes.clothes.properties;

import lombok.Getter;

@Getter
public enum Fit implements Property {
    OVERFIT("오버핏"),
    SEMI_OVERFIT("세미오버핏"),
    REGULAR_FIT("레귤러핏"),
    SLIM_FIT("슬림핏");

    private final String displayName;

    Fit(String displayName) {
        this.displayName = displayName;
    }

    @Override
    public String getCode() {
        return this.name();
    }

    @Override
    public String getName() {
        return this.displayName;
    }
}