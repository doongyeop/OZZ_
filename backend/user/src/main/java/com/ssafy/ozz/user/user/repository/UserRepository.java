package com.ssafy.ozz.user.user.repository;

import com.ssafy.ozz.user.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
}