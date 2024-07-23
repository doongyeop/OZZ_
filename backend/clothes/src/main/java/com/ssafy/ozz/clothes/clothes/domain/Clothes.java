package com.ssafy.ozz.clothes.clothes.domain;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.clothes.properties.Fit;
import com.ssafy.ozz.clothes.clothes.properties.Size;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
public class Clothes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clothesId;

    @Column(length = 255)
    private String name;

    @Column(columnDefinition = "TINYINT")
    private Size size;

    @Column(columnDefinition = "TINYINT")
    private Fit fit;

    @Column(length = 255)
    private String memo;

    @Column(length = 50)
    private String brand;

    @Column
    private LocalDateTime purchaseDate;

    @Column(length = 100)
    private String purchaseSite;

    @Column(length = 100)
    @Builder.Default
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(columnDefinition = "BIT(32)")
    private Integer color;

    @Column(columnDefinition = "BIT(32)")
    private Integer texture;

    @Column(columnDefinition = "BIT(32)")
    private Integer style;

    @Column(columnDefinition = "BIT(4)")
    private Integer season;

    /* FOREIGN KEY */
    @Column
    Long imageFileId;

    @ManyToOne
    @JoinColumn(name="category_low_id")
    CategoryLow categoryLow;

    @Column
    Long userId;
}
