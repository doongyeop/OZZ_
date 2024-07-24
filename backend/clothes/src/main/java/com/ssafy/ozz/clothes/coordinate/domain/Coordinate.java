package com.ssafy.ozz.clothes.coordinate.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
}
