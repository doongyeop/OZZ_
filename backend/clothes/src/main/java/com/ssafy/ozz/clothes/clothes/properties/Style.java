package com.ssafy.ozz.clothes.clothes.properties;

import lombok.Getter;

@Getter
public enum Style {
    CASUAL("캐주얼"),
    CLASSIC("클래식"),
    MANNISH("매니시"),
    FEMININE("페미닌"),
    HIPPIE("히피"),
    MODERN("모던"),
    COUNTRY("컨트리"),
    GENDERLESS("젠더리스"),
    SPORTY("스포티"),
    RETRO("레트로"),
    MILITARY("밀리터리"),
    PREPPY("프레피"),
    TOMBOY("톰보이"),
    ROMANTIC("로맨틱"),
    WESTERN("웨스턴"),
    SOPHISTICATED("소피스트"),
    COTTAGER("케이티드"),  // Assuming "케이티드" is meant to be "COTTAGER"
    RESORT("리조트"),
    KITSCH("키치"),
    KIDULT("키덜트"),
    STREET("스트릿"),
    SEXY("섹시"),
    ORIENTAL("오리엔탈"),
    AVANT_GARDE("아방가르드"),
    HIPHOP("힙합"),
    PUNK("펑크");

    private final String displayName;

    Style(String displayName) {
        this.displayName = displayName;
    }
}
