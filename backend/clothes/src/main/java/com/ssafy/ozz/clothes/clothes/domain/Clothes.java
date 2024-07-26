package com.ssafy.ozz.clothes.clothes.domain;

import com.ssafy.ozz.clothes.category.domain.CategoryHigh;
import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.clothes.properties.Fit;
import com.ssafy.ozz.clothes.clothes.properties.Size;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

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
    private LocalDate purchaseDate;

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

    //== 비즈니스 로직 ==//
    public void changeCategoryLow(CategoryLow categoryLow) {
        if(categoryLow != null) this.categoryLow = categoryLow;
    }

    public void changeName(String name) {
        if(name != null) this.name = name;
    }

    public void changeSize(Size size) {
        if(size != null) this.size = size;
    }

    public void changeFit(Fit fit) {
        if(fit != null) this.fit = fit;
    }

    public void changeMemo(String memo) {
        if(memo != null) this.memo = memo;
    }

    public void changeBrand(String brand) {
        if(brand != null) this.brand = brand;
    }

    public void changePurchaseDate(LocalDate purchaseDate) {
        if(purchaseDate != null) this.purchaseDate = purchaseDate;
    }

    public void changePurchaseSite(String purchaseSite) {
        if(purchaseSite != null) this.purchaseSite = purchaseSite;
    }

    public void changeColor(Integer color){
        if(color != null) this.color = color;
    }

    public void changeTexture(Integer texture){
        if(texture != null) this.texture = texture;
    }

    public void changeSeason(Integer season){
        if(season != null) this.season = season;
    }

    public void changeStyle(Integer style){
        if(style != null) this.style = style;
    }

    //== 테스트 기능 ==//

    // Method to create a mock Clothes object
    public static Clothes mock(Long userId, CategoryHigh categoryHigh) {
        Clothes clothes = new Clothes();
        Random RANDOM = new Random();

        clothes.name = "Name" + RANDOM.nextInt(1000); // Random String
        clothes.size = Size.values()[RANDOM.nextInt(Size.values().length)]; // Random enum value
        clothes.fit = Fit.values()[RANDOM.nextInt(Fit.values().length)]; // Random enum value
        clothes.memo = "Memo" + RANDOM.nextInt(1000); // Random String
        clothes.brand = "Brand" + RANDOM.nextInt(1000); // Random String
        clothes.purchaseDate = LocalDate.now().minusDays(RANDOM.nextInt(365)); // Random past date
        clothes.purchaseSite = "Site" + RANDOM.nextInt(1000); // Random String
        clothes.createdDate = LocalDateTime.now(); // Current date-time
        clothes.color = RANDOM.nextInt(256); // Random integer (8-bit)
        clothes.texture = RANDOM.nextInt(256); // Random integer (8-bit)
        clothes.style = RANDOM.nextInt(256); // Random integer (8-bit)
        clothes.season = RANDOM.nextInt(16); // Random integer (4-bit)
        clothes.imageFileId = (long) RANDOM.nextInt(1000); // Random Long
        clothes.categoryLow = categoryHigh.getCategoryLowList().get(RANDOM.nextInt(categoryHigh.getCategoryLowList().size())); // Assume CategoryLow has a no-args constructor
        clothes.userId = userId;

        return clothes;
    }
}
