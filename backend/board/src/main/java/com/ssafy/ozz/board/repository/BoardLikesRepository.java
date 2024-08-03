package com.ssafy.ozz.board.repository;

import com.ssafy.ozz.board.domain.BoardLikes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface BoardLikesRepository extends JpaRepository<BoardLikes, Long> {

    int countByBoardId(Long boardId);
    Optional<BoardLikes> findById(BoardLikes.BoardLikesId boardLikesId);
}
