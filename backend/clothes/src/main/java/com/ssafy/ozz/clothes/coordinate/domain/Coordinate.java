package com.ssafy.ozz.clothes.coordinate.domain;

import com.ssafy.ozz.clothes.clothes.properties.Style;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toBits;

@Table
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@ToString
public class Coordinate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long coordinateId;

    @Column(columnDefinition = "BIT(32)")
    private Integer style;

    @Column(length = 100)
    private String name;

    @Column
    @Builder.Default
    private LocalDateTime createdDate = LocalDateTime.now();

    @OneToMany(mappedBy = "coordinate")
    @Builder.Default
    private List<CoordinateClothes> coordinateClothesList = new ArrayList<>();

    /* FOREIGN KEY */
    private Long userId;
    private Long imageFileId;

    //== 비즈니스 로직 ==//
    public void updateName(String name) {
        if(name != null) this.name = name;
    }

    public void updateStyle(List<Style> styleList) {
        if(styleList != null) this.style = toBits(styleList);
    }

    public void setCoordinateClothesList(List<CoordinateClothes> coordinateClothesList) {
        // 실제 DB 상에서 변경은 안됨
        if(coordinateClothesList != null) this.coordinateClothesList = coordinateClothesList;
    }
}
