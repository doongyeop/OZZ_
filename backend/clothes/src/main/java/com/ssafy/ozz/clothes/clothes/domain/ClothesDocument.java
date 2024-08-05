package com.ssafy.ozz.clothes.clothes.domain;

import com.ssafy.ozz.clothes.global.es.Indices;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toBit;

@Document(indexName = Indices.CLOTHES_INDEX)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setting(settingPath = "elastic/elastic-settings.json", replicas = 0) // replicas는 운영시 변경
@ToString
public class ClothesDocument {
    @Id
    private String id;

    @Field(name = "clothes_id", type = FieldType.Long)
    private Long clothesId;

    @Field(type = FieldType.Text, analyzer = "synonym_analyzer")
    private String name;

    @Field(type = FieldType.Dense_Vector, dims = 768)
    private float[] vector;

    @Field(type = FieldType.Byte)
    private Integer size;

    @Field(type = FieldType.Byte)
    private Integer fit;

    @Field(type = FieldType.Text, analyzer = "nori")
    private String memo;

    @Field(type = FieldType.Text, analyzer = "nori")
    private String brand;

    @Field(name = "purchase_date", type = FieldType.Date, pattern = "yyyy-MM-dd")
    private LocalDate purchaseDate;

    @Field(name = "purchase_site",type = FieldType.Text, analyzer = "nori")
    private String purchaseSite;

    @Field(name = "created_date",type = FieldType.Date, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
    private LocalDateTime createdDate;

    @Field(name = "updated_date",type = FieldType.Date, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
    private LocalDateTime updatedDate;

    @Field(type = FieldType.Integer)
    private Integer color;

    @Field(type = FieldType.Integer)
    private Integer texture;

    @Field(type = FieldType.Integer)
    private Integer style;

    @Field(type = FieldType.Integer)
    private Integer season;

    @Field(type = FieldType.Integer)
    private Integer pattern;

    /* FOREIGN KEY */
    @Field(name = "image_file_id",type = FieldType.Long)
    Long imageFileId;

    @Field(name = "category_low_id",type = FieldType.Byte)
    Byte categoryLowId;

    @Field(name = "user_id",type = FieldType.Long)
    Long userId;

    public ClothesDocument(Clothes clothes) {
        this.clothesId = clothes.getClothesId();
        this.name = clothes.getName();
        this.size = toBit(clothes.getSize());
        this.fit = toBit(clothes.getFit());
        this.memo = clothes.getMemo();
        this.brand = clothes.getBrand();
        this.createdDate = clothes.getCreatedDate();
        this.updatedDate = clothes.getUpdatedDate();
        this.color = clothes.getColor();
        this.texture = clothes.getTexture();
        this.style = clothes.getStyle();
        this.season = clothes.getSeason();
        this.pattern = clothes.getPattern();
        this.imageFileId = clothes.getImageFileId();
        this.categoryLowId = clothes.getCategoryLow().getCategoryLowId();
        this.userId = clothes.getUserId();
    }
}

