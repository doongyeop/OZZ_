package com.ssafy.ozz.clothes.clothes.service;

import com.ssafy.ozz.clothes.category.domain.CategoryLow;
import com.ssafy.ozz.clothes.category.service.CategoryService;
import com.ssafy.ozz.clothes.clothes.domain.Clothes;
import com.ssafy.ozz.clothes.clothes.dto.request.*;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesBasicWithFileResponse;
import com.ssafy.ozz.clothes.clothes.dto.response.ClothesWithFileResponse;
import com.ssafy.ozz.clothes.clothes.dto.response.NormalizedItem;
import com.ssafy.ozz.clothes.clothes.dto.response.NormalizedResponse;
import com.ssafy.ozz.clothes.clothes.exception.ClothesNotFoundException;
import com.ssafy.ozz.clothes.clothes.repository.jpa.ClothesRepository;
import com.ssafy.ozz.clothes.clothes.repository.elasticsearch.ClothesSearchRepository;
import com.ssafy.ozz.clothes.global.fegin.file.FileClient;
import com.ssafy.ozz.clothes.global.fegin.file.dto.FeignFileInfo;
import com.ssafy.ozz.clothes.global.fegin.file.exception.FileNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

import java.util.ArrayList;
import java.util.List;

import static com.ssafy.ozz.clothes.global.util.EnumBitwiseConverter.toBits;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ClothesServiceImpl implements ClothesService {
    private final ClothesRepository clothesRepository;
    private final CategoryService categoryService;
    private final FileClient fileClient;
    private final WebClient webClient;
    private final MqService mqService;

    @Override
    @Transactional(readOnly = true)
    public Clothes getClothes(Long clothesId) {
        return clothesRepository.findById(clothesId).orElseThrow(ClothesNotFoundException::new);
    }

    @Override
    public ClothesWithFileResponse getClothesWithFile(Long clothesId){
        Clothes clothes = getClothes(clothesId);
        return new ClothesWithFileResponse(clothes,fileClient.getFile(clothes.getImageFileId()).orElseThrow(FileNotFoundException::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ClothesBasicWithFileResponse> getClothesOfUserWithFile(Long userId, ClothesSearchCondition condition, Pageable pageable) {
        return clothesRepository.findByUserId(userId, condition, pageable).map(clothes -> {
            FeignFileInfo fileInfo = fileClient.getFile(clothes.getImageFileId()).orElseThrow(FileNotFoundException::new);
            return new ClothesBasicWithFileResponse(clothes, fileInfo);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<Clothes> getClothesOfUser(Long userId, ClothesSearchCondition condition, Pageable pageable) {
        return clothesRepository.findByUserId(userId, condition, pageable);
    }

    @Override
    public Clothes saveClothes(Long userId, MultipartFile imageFile, ClothesCreateRequest request) {
        CategoryLow categoryLow = categoryService.getCategoryLow(request.categoryLowId());
        // TODO : 이미지 파일 저장 후 id 값 가져오기
        log.debug(imageFile.toString());
        FeignFileInfo fileInfo = fileClient.uploadFile(imageFile).orElseThrow();
        log.debug(fileInfo.toString());

        Long imageFileId = fileInfo.fileId();
        return clothesRepository.save(request.toEntity(categoryLow,imageFileId,userId));
    }

    @Override
    public Clothes updateClothes(Long clothesId, ClothesUpdateRequest request) {
        Clothes clothes = getClothes(clothesId);
        if(request.categoryLowId() != null)
            clothes.changeCategoryLow(categoryService.getCategoryLow(request.categoryLowId()));
        clothes.changeName(request.name());
        clothes.changeSize(request.size());
        clothes.changeFit(request.fit());
        clothes.changeMemo(request.memo());
        clothes.changeBrand(request.brand());
        clothes.changePurchaseDate(request.purchaseDate());
        clothes.changePurchaseSite(request.purchaseSite());
        clothes.changeColor(toBits(request.colorList()));
        clothes.changeTexture(toBits(request.textureList()));
        clothes.changeSeason(toBits(request.seasonList()));
        clothes.changeStyle(toBits(request.styleList()));
        clothes.changePattern(toBits(request.patternList()));
        return clothes;
    }

    @Override
    public ClothesWithFileResponse updateClothes(Long clothesId, ClothesUpdateRequest request, MultipartFile imageFile) {
        Clothes clothes = updateClothes(clothesId, request);
        FeignFileInfo fileInfo;
        if(imageFile != null){
            // 이미지 파일 수정
            fileInfo = fileClient.uploadFile(imageFile).orElseThrow();
            clothes.updateImageFile(fileInfo.fileId());
        }else{
            // 기존 이미지 파일 불러오기
            fileInfo = fileClient.getFile(clothes.getImageFileId()).orElseThrow();
        }

        return new ClothesWithFileResponse(clothes, fileInfo);
    }

    @Override
    public void deleteClothes(Long clothesId) {
        clothesRepository.deleteById(clothesId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Clothes> getClothesInCoordinate(Long coordinateId) {
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Clothes> getClothesInRecCoordinate(Long coordinateId) {
        return List.of();
    }

    @Override
    public Flux<ServerSentEvent<String>> batchRegisterPurchaseHistory(Long userId, List<PurchaseHistory> purchaseHistories) {
        int totalItems = purchaseHistories.size();
        int batchSize = 10;

        Sinks.Many<ServerSentEvent<String>> sink = Sinks.many().unicast().onBackpressureBuffer();
        System.out.println("요청 저리");

        webClient.mutate().baseUrl("http://localhost:8000").build()
                .post()
                .uri("/purchase-history/normalize")
                .bodyValue(purchaseHistories)
                .retrieve()
                .bodyToFlux(NormalizedResponse.class)
                .publishOn(Schedulers.boundedElastic())
                .publishOn(Schedulers.boundedElastic())
                .flatMap(response->{
                    int index= response.index()*batchSize;
                    List<ExtractAttribute> extractAttributes = new ArrayList<>();
                    for (NormalizedItem item : response.data()) {
                        if(!item.category().equals("None")){
                            PurchaseHistory purchaseHistory=purchaseHistories.get(index);
                            Long clothId = clothesRepository.save(purchaseHistory.toEntity(userId,item.name())).getClothesId();
                            ExtractAttribute temp=item.toExtractAttribute(clothId, purchaseHistory.imgUrl());
                            extractAttributes.add(temp);
                        }
                        index++;
                    }
                    mqService.send(extractAttributes);
                    System.out.println(extractAttributes);
                    return Mono.just(100*((index+1)/((totalItems/batchSize)+1)));
                })
                .doOnNext(progress -> {
                    sink.tryEmitNext(ServerSentEvent.builder(progress+"%").build());
                })
                .doOnComplete(sink::tryEmitComplete)
                .subscribe();

        return sink.asFlux();
    }

    /* Elasticsearch */
    @Override
    @Transactional(readOnly = true)
    public Slice<ClothesBasicWithFileResponse> searchClothes(ClothesSearchCondition condition, Pageable pageable) {
        return clothesRepository.findByCondition(condition, pageable).map(clothes -> {
//            log.debug(clothes.toString());
//            FeignFileInfo fileInfo = new FeignFileInfo(1L,"","","");
//            CategoryLow categoryLow = CategoryLow.builder().build();
                FeignFileInfo fileInfo = fileClient.getFile(clothes.getImageFileId()).orElseThrow(FileNotFoundException::new);
                CategoryLow categoryLow = categoryService.getCategoryLow(clothes.getCategoryLowId());
            return new ClothesBasicWithFileResponse(clothes, categoryLow, fileInfo);
        });
    }
}
