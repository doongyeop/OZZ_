package com.ssafy.ozz.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class LoggingGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();

        // 요청 본문을 읽기 위한 Flux
        Mono<String> body = exchange.getRequest().getBody().map(dataBuffer -> {
            // 데이터 버퍼를 문자열로 변환
            return dataBuffer.toString(StandardCharsets.UTF_8);
        }).collectList().map(list -> String.join("", list));

        // 요청 본문을 로그에 기록
        return body.flatMap(requestBody -> {
            log.info("요청 URL: {}", request.getURI());
            log.info("요청 메서드: {}", request.getMethod());
            log.info("요청 헤더: {}", request.getHeaders());
            log.info("요청 본문: {}", requestBody);

            // 요청 본문을 다시 요청에 설정
            ServerHttpRequest mutatedRequest = request.mutate().build();
            ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();

            return chain.filter(mutatedExchange).doFinally(signalType -> {
                // 응답 로그 기록
                log.info("응답 상태 코드: {}", response.getStatusCode());
                log.info("응답 헤더: {}", response.getHeaders());
            });
        });
    }

    @Override
    public int getOrder() {
        return -2; // 이 필터가 다른 필터들보다 먼저 실행되도록 설정
    }
}
