package com.ssafy.ozz.clothes.coordinate.repository.elasticsearch;

import co.elastic.clients.elasticsearch._types.query_dsl.FunctionBoostMode;
import co.elastic.clients.json.JsonData;
import com.ssafy.ozz.clothes.clothes.domain.ClothesDocument;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesSearchCondition;
import com.ssafy.ozz.clothes.clothes.dto.request.VectorRequest;
import com.ssafy.ozz.clothes.clothes.dto.response.VectorResponse;
import com.ssafy.ozz.clothes.coordinate.domain.CoordinateDocument;
import com.ssafy.ozz.clothes.coordinate.dto.CoordinateSearchCondition;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class CoordinateSearchQueryRepositoryImpl implements CoordinateSearchQueryRepository {

    private final ElasticsearchOperations operations;
    private final WebClient webClient;

    public float[] getVector(String text) {
        return Objects.requireNonNull(webClient.post()
                .uri("/vectorize")
                .bodyValue(VectorRequest.of(text))
                .retrieve()
                .bodyToMono(VectorResponse.class).block()).vector();
    }

    public Page<CoordinateDocument> findByCondition(CoordinateSearchCondition condition, Pageable pageable) {
//        Query query = createConditionNativeQuery(condition,pageable);
        Query query = createConditionNativeQuery(condition,pageable);

        SearchHits<CoordinateDocument> searchHits = operations.search(query, CoordinateDocument.class);

        List<CoordinateDocument> documents = searchHits
                .stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());

        return new PageImpl<>(documents, pageable, searchHits.getTotalHits());
    }

    private Query createConditionNativeQuery(CoordinateSearchCondition condition, Pageable pageable) {
        // Split search term into tokens
        String[] tokens = condition.keyword().split("\\s+");

        return NativeQuery.builder()
                .withQuery(q->q
                    .bool(b->{
                        b
//                        .must(m->m
//                            .match(mm->mm
//                                .field("name")
//                                .query(condition.keyword())
//                            )
//                        )
                        // 무신사 검은 셔츠 검색시 '무신사' '검은' '셔츠'가 모두 들어있는 document는 점수를 높힘
                        .should(s->s
                            .matchPhrase(mm->mm
                                .field("name")
                                .query(condition.keyword())
                            )
                        );

                        // 무신사 검은 셔츠 검색시 '무신사', '검은', '셔츠' 각 토큰이 정확히 검색되는 document는 점수를 높힘 (유사어 고려 X)
                        for (String token : tokens) {
                            b.should(s->s
                                .term(mm->mm
                                    .field("name")
                                    .value(token)
                                )
                            );
                        }

                        return b;
                    })
                )
                .withPageable(pageable) // Pagination
                .build();
    }


    private Query createSearchQuery(CoordinateSearchCondition condition, Pageable pageable) {
        float[] vector = getVector(condition.keyword());

        return NativeQuery.builder()
                .withQuery(q->q
                    .functionScore(f->f
                        .query(qq->qq
                            .bool(b->b
                                .filter(ff->ff
                                    .term(t->t
                                        .field("status")
                                        .value("published")
                                    )
                                )
                                // 무신사 검은 셔츠 검색시 '무신사' '검은' '셔츠'가 들어있는 document는 점수를 높힘
                                .should(bs->bs
                                    .match(mm->mm
                                        .field("name")
                                        .query(condition.keyword())
                                    )
                                )
                            )
                        )
                        .functions(ff->ff
                            // 무신사 검은 셔츠 검색시 '무신사 검은 셔츠'와 비슷한 vector를 가진 document의 score를 증가
                            .scriptScore(s -> s
                                .script(ss->ss
                                    .inline(si->si
                                        .source("cosineSimilarity(params.vector, 'vector') + 1.0")
                                        .params(Collections.singletonMap("vector", JsonData.of(vector)))
                                    )
                                )
                            )
                        )
                        .boostMode(FunctionBoostMode.Multiply)
                    )
                )
                .withPageable(pageable) // Pagination
                .build();
    }
}