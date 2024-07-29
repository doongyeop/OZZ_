package com.ssafy.ozz.auth.provider.repository;

import com.ssafy.ozz.auth.provider.domain.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByUserIdAndName(Long userId, String name);
    Optional<Provider> findByIdFromProviderAndName(String idFromProvider, String name);
}
