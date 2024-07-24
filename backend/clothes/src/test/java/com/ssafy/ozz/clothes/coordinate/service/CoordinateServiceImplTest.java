package com.ssafy.ozz.clothes.coordinate.service;

import com.ssafy.ozz.clothes.category.domain.CategoryHigh;
import com.ssafy.ozz.clothes.category.service.CategoryService;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.properties.Style;
import com.ssafy.ozz.clothes.clothes.repository.ClothesRepository;
import com.ssafy.ozz.clothes.coordinate.domain.Coordinate;
import com.ssafy.ozz.clothes.coordinate.domain.CoordinateClothes;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateClothesCreateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateCreateRequest;
import com.ssafy.ozz.clothes.coordinate.dto.SearchCondition;
import com.ssafy.ozz.clothes.coordinate.repository.CoordinateClothesRepository;
import jakarta.transaction.Transactional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toBits;

@SpringBootTest
@Transactional
//@Rollback(value = false)
@ActiveProfiles("test")
class CoordinateServiceImplTest {
    @Autowired
    private CoordinateService coordinateService;

    @Autowired
    private ClothesRepository clothesRepository;

    @Autowired
    private CoordinateClothesRepository coordinateClothesRepository;

    @Autowired
    private CategoryService categoryService;

    // 픽스처
    List<Clothes> clothesList = new ArrayList<>();
    Long userId = 1L;

    @BeforeEach
    void setUp() {
        // 상위 카테고리별로 1개씩 옷 생성
        List<CategoryHigh> categoryHighList = categoryService.getAllCategoryHigh();
        categoryHighList.forEach(categoryHigh -> {
            clothesList.add(clothesRepository.save(Clothes.mock(userId,categoryHigh)));
        });
    }

    @Test
    void createCoordinate() {
        // given
        String name = "서터릿 코디";
        List<Style> styleList = Arrays.asList(Style.STREET, Style.CASUAL);
        CoordinateCreateRequest request = getCoordinateCreateRequest(name, styleList);
        // when
        Coordinate coordinate = coordinateService.createCoordinate(userId, null, request);

        // then
        List<CoordinateClothes> coordinateClothes = coordinateClothesRepository.findByCoordinate(coordinate);
        Assertions.assertThat(coordinateClothes.size()).isEqualTo(clothesList.size());
        Assertions.assertThat(coordinate.getName()).isEqualTo(name);
        Assertions.assertThat(coordinate.getStyle()).isEqualTo(toBits(styleList));
    }

    CoordinateCreateRequest getCoordinateCreateRequest(String name, List<Style> styleList) {
        return CoordinateCreateRequest.builder()
                .name(name)
                .styleList(styleList)
                .clothes(clothesList.stream().map(clothes ->
                        CoordinateClothesCreateRequest.builder().clothesId(clothes.getClothesId()).offset(1).build()).toList())
                .build();
    }

    @Test
    void getCoordinate() {
        // given
        String name = "캐주얼 코디";
        List<Style> styleList = Arrays.asList(Style.CASUAL, Style.CLASSIC);
        CoordinateCreateRequest request = getCoordinateCreateRequest(name, styleList);
        Long coordinateId = coordinateService.createCoordinate(userId, null, request).getCoordinateId();

        // when
        Coordinate coordinate = coordinateService.getCoordinate(coordinateId);

        // then
        Assertions.assertThat(coordinate.getCoordinateId()).isEqualTo(coordinateId);
    }

    @Test
    void getCoordinatesOfUser() {
        // pagenation 적용 X
        // given
        String name = "캐주얼 코디";
        List<Style> styleList = Arrays.asList(Style.CASUAL, Style.CLASSIC);
        CoordinateCreateRequest request = getCoordinateCreateRequest(name, styleList);
        coordinateService.createCoordinate(userId, null, request);

        String name2 = "캐주얼 코디";
        List<Style> styleList2 = Arrays.asList(Style.CASUAL, Style.STREET);
        CoordinateCreateRequest request2 = getCoordinateCreateRequest(name2, styleList2);
        coordinateService.createCoordinate(userId, null, request2);

        SearchCondition condition = SearchCondition.builder()
                .styleList(List.of(Style.CASUAL))
                .build();

        // when
        List<Coordinate> coordinateList = coordinateService.getCoordinatesOfUser(userId, condition);

        // then
        Assertions.assertThat(coordinateList.size()).isEqualTo(2);
    }

    @Test
    void testGetCoordinatesOfUser() {
    }

    @Test
    void updateCoordinate() {
    }

    @Test
    void deleteCoordinate() {
    }
}