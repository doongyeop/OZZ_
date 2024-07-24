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
import com.ssafy.ozz.clothes.coordinate.repository.CoordinateClothesRepository;
import com.ssafy.ozz.clothes.coordinate.repository.CoordinateRepository;
import jakarta.transaction.Transactional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
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
    private CoordinateRepository coordinateRepository;

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
        CoordinateCreateRequest request = CoordinateCreateRequest.builder()
                .name(name)
                .styleList(styleList)
                .clothes(clothesList.stream().map(clothes ->
                        CoordinateClothesCreateRequest.builder().clothesId(clothes.getClothesId()).offset(1).build()).toList())
                .build();
        // when
        Long coordinateId = coordinateService.createCoordinate(userId, null, request);

        // then
        Coordinate coordinate = coordinateRepository.findById(coordinateId).orElseThrow();
        List<CoordinateClothes> coordinateClothes = coordinateClothesRepository.findByCoordinate(coordinate);
        Assertions.assertThat(coordinateClothes.size()).isEqualTo(clothesList.size());
        Assertions.assertThat(coordinate.getName()).isEqualTo(name);
        Assertions.assertThat(coordinate.getStyle()).isEqualTo(toBits(styleList));
    }

    @Test
    void getCoordinate() {
    }

    @Test
    void getCoordinatesOfUser() {
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