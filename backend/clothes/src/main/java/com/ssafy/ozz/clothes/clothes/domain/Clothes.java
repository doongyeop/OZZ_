package com.ssafy.ozz.clothes.clothes.domain;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
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
    Long clothesId;

    @Column(columnDefinition = "BIT(32)")
    private Integer color;

    @Column(length = 255)
    private String name;

    @Column
    private Byte size;

    @Column
    private Byte fit;

    @Column(columnDefinition = "BIT(32)")
    private Integer texture;

    @Column(length = 255)
    private String memo;

    @Column(length = 50)
    private String brand;

    @Column
    private LocalDateTime purchaseDate;

    @Column(length = 100)
    private String purchaseSite;

    @Column(length = 100)
    private LocalDateTime createDate;

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
