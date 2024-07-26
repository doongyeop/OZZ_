package com.ssafy.ozz.clothes.clothes.dto.response;

import com.ssafy.ozz.clothes.clothes.properties.Property;

public record PropertyResponse (
    String code,
    String name
){
    public PropertyResponse (Property property){
        this(property.getCode(), property.getName());
    }
}
