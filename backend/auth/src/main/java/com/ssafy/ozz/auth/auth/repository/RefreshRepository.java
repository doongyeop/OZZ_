package com.ssafy.ozz.auth.auth.repository;

import com.ssafy.ozz.auth.auth.domain.Refresh;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;

public interface RefreshRepository extends CrudRepository<Refresh, Long> {

    boolean existsByRefresh(String refresh);

    @Transactional
    void deleteByRefresh(String refresh);

    void deleteByUserId(Long id);
}
