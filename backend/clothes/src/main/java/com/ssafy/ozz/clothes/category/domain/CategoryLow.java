package com.ssafy.ozz.clothes.category.domain;

import jakarta.persistence.*;
import lombok.*;

@Table
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
public class CategoryLow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Byte categoryLowId;

    @Column(length = 30)
    String name;

    /* FOREIGN KEY */
    @ManyToOne
    @JoinColumn(name = "category_high_id")
    CategoryHigh categoryHigh;
}