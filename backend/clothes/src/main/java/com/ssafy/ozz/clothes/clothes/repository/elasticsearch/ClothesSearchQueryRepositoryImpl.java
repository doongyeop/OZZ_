package com.ssafy.ozz.clothes.clothes.repository.elasticsearch;

import com.ssafy.ozz.clothes.clothes.domain.ClothesDocument;
import com.ssafy.ozz.clothes.clothes.dto.request.ClothesSearchCondition;
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

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ClothesSearchQueryRepositoryImpl implements ClothesSearchQueryRepository {

    private final ElasticsearchOperations operations;

    public Page<ClothesDocument> findByCondition(ClothesSearchCondition condition, Pageable pageable) {
        Query query = createConditionNativeQuery(condition,pageable);

        SearchHits<ClothesDocument> searchHits = operations.search(query, ClothesDocument.class);
        List<ClothesDocument> documents = searchHits
                .stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());

        // Create and return a Page object with the results
        return new PageImpl<>(documents, pageable, searchHits.getTotalHits());
    }

    private Query createConditionNativeQuery(ClothesSearchCondition condition, Pageable pageable) {
        // Split search term into tokens
        String[] tokens = condition.keyword().split("\\s+");

        return NativeQuery.builder()
                .withQuery(q->q
                    .bool(b->{
                        b.must(m->m
                            .match(mm->mm
                                .field("name")
                                .query(condition.keyword())
                            )
                        )
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

}