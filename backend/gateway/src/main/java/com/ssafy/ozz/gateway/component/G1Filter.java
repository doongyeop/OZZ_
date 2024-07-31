package com.ssafy.ozz.gateway.component;

import com.ssafy.ozz.auth.global.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class G1Filter implements GlobalFilter {

    private final JWTUtil jwtUtil;

    @Autowired
    public G1Filter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // MS 이전 (pre)
        HttpHeaders headers = exchange.getRequest().getHeaders();
        // 프론트에서 request 헤더에 Authorization 토큰 필요
        String token = headers.getFirst(HttpHeaders.AUTHORIZATION);

        if (token == null || !token.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        token = token.substring(7); // "Bearer " 빼고 시작
        String userId;
        try {
            userId = jwtUtil.getUserId(token);
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 사용자 ID가 null이거나 유효하지 않으면 인가 거부
        if (userId == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 사용자 ID를 다른 서비스로 전달하는 경우, 헤더에 추가
        exchange.getRequest().mutate().header("X-User-Id", userId).build();

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            // MS 이후 (post)
        }));
    }

    // 추가로 필터 필요할 경우 Ordered도 implements 받아서
    // getOrder 구현 후 순번 만들기
    // 순서 : pre -2 > pre -1 > MS > post -1 > post -2
}

