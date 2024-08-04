package com.ssafy.ozz.clothes.coordinate.domain;

import com.ssafy.ozz.clothes.clothes.properties.Style;
import com.ssafy.ozz.clothes.global.es.Indices;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toBits;

@Document(indexName = Indices.COORDINATE_INDEX)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setting(settingPath = "elastic/elastic-settings.json", replicas = 0) // replicas는 운영시 변경
@ToString
public class CoordinateDocument {
    @Id
    private String id;

    @Field(name = "coordinate_id", type = FieldType.Long)
    private Long coordinateId;

    @Field(type = FieldType.Integer)
    private Integer style;

    @Field(type = FieldType.Text, analyzer = "synonym_analyzer")
    private String name;

    @Field(name = "created_date",type = FieldType.Date, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
    private LocalDateTime createdDate = LocalDateTime.now();

    /* FOREIGN KEY */
    @Field(name = "user_id", type = FieldType.Long)
    private Long userId;
    @Field(name = "image_file_id", type = FieldType.Long)
    private Long imageFileId;
}
