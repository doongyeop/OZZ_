package com.ssafy.ozz.gateway.component;

import com.ssafy.ozz.auth.global.util.JWTUtil;
// implementation 'com.ssafy.ozz:ozz-auth:1.0.0' Gradle에 추가하면 끌어 쓸 수 있음.
import lombok.RequiredArgsConstructor;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class G1Filter implements GlobalFilter {

    private final JWTUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // MS 이전 (pre)
        HttpHeaders headers = exchange.getRequest().getHeaders();
        // Authorization 헤더에 토큰 필요
        String token = headers.getFirst(HttpHeaders.AUTHORIZATION);

        if (token == null || !token.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        token = token.substring(7); // "Bearer " 빼고 시작
        String userId;
        try {
            userId = jwtUtil.getUserId(token);
            // JWT 유효성 검사
            if (jwtUtil.isExpired(token)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 사용자 ID가 null이거나 유효하지 않으면 인가 거부
        if (userId == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Gateway에서 전달한 사용자 ID와 JWT에서 추출한 사용자 ID가 일치하는지 확인
        String gatewayUserId = headers.getFirst("X-User-Id");

        if (gatewayUserId != null && !gatewayUserId.equals(userId)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 사용자 ID를 다른 서비스로 전달, 헤더에 추가
        ServerWebExchange modifiedExchange = exchange.mutate().request(r -> r.header("X-User-Id", userId)).build();

        return chain.filter(modifiedExchange).then(Mono.fromRunnable(() -> {
            // MS 이후 (post)
        }));
    }

    // 추가로 필터 필요할 경우 Ordered도 implements 받아서
    // getOrder 구현 후 순번 만들기
    // 순서 : pre -2 > pre -1 > MS > post -1 > post -2
}

