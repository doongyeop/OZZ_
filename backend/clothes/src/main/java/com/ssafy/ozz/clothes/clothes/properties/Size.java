package com.ssafy.ozz.clothes.clothes.properties;

import lombok.Getter;

@Getter
public enum Size {
    FREE("free"),
    S("small"),
    M("medium"),
    L("large"),
    XL("xlarge"),
    XXL("xxlarge");

    private final String displayName;

    Size(String displayName) {
        this.displayName = displayName;
    }

    public Byte toByte(){
        return (byte) ordinal();
    }
}
