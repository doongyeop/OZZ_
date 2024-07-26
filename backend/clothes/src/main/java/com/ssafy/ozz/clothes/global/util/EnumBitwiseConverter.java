package com.ssafy.ozz.clothes.global.util;

import java.util.ArrayList;
import java.util.List;

public class EnumBitwiseConverter {

    public static <E extends Enum<E>> Integer toBit(E e){
        return 1 << e.ordinal();
    }

    public static <E extends Enum<E>> Integer toBits(List<E> enums){
        if(enums == null) return null;

        int value = 0;
        for (E enumInstance : enums) {
            value |= toBit(enumInstance);
        }
        return value;
    }

    public static <E extends Enum<E>> List<E> toEnums(Class<E> enumClass, int value) {
        List<E> enums = new ArrayList<>();
        int index = 0;
        while (value != 0) {
            if ((value & 1) == 1) {
                enums.add(fromIndex(enumClass, index));
            }
            value >>= 1;
            index++;
        }
        return enums;
    }

    public static <E extends Enum<E>> E fromIndex(Class<E> enumClass, int index) {
        for (E enumConstant : enumClass.getEnumConstants()) {
            if (enumConstant.ordinal() == index) {
                return enumConstant;
            }
        }
        throw new IllegalArgumentException("No enum constant with index: " + index);
    }
}
