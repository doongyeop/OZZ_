package com.ssafy.ozz.board.repository;

import com.ssafy.ozz.board.domain.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long>, PagingAndSortingRepository<Board, Long> {
    Optional<Board> findByUserId(Long userId);
}
