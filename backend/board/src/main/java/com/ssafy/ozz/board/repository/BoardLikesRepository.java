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

    @Query("SELECT new map(bl.boardId as boardId, bl.userId as userId, u.nickname as nickname, bl.createdDate as createdDate) " +
            "FROM BoardLikes bl " +
            "JOIN User u ON bl.userId = u.id " +
            "WHERE bl.boardId = :boardId")
    List<Map<String, Object>> getLikesCountByBoardId(@Param("boardId") Long boardId);

    Optional<BoardLikes> findById(BoardLikes.BoardLikesId boardLikesId);
}
