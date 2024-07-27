package com.ssafy.ozz.user.auth.repository;

import com.ssafy.ozz.user.auth.domain.Refresh;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;

public interface RefreshRepository extends CrudRepository<Refresh, Long> {

    boolean existsByRefresh(String refresh);

    @Transactional
    void deleteByRefresh(String refresh);

    void deleteByUserId(Long id);
}
