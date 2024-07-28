package com.ssafy.ozz.clothes.clothes.properties;

import lombok.Getter;

@Getter
public enum PropertySelector {
    FIT(Fit.class),
    SEASON(Season.class),
    SIZE(Size.class),
    STYLE(Style.class),
    TEXTURE(Texture.class),
    COLOR(Color.class),
    PATTERN(Pattern.class);

    private final Class<? extends Property> propertyClass;

    PropertySelector(Class<? extends Property> propertyClass) {
        this.propertyClass = propertyClass;
    }
}
